/*
 * Copyright (c) 2019-2022 David Timber <dxdt@dev.snart.me>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { stringify } from "./node_modules/csv-stringify/dist/esm/index.js";

function onerror (e, ctx) {
	postMessage({
		"task_id": ctx.task_id,
		"error": e
	});
}

function mkstringifier (ctx) {
	const ret = stringify();
	const csvdata = [];

	ret.on('readable', function () {
		let row;

		while ((row = ret.read()) !== null) {
			csvdata.push(row);
		}
	});

	ret.on('finish', function () {
		postMessage({
			"task_id": ctx.task_id,
			"meta": ctx.meta,
			"payload": csvdata.join(""),
		});
	});

	return ret;
}

function procMeta (ctx, data) {
	ctx.meta = {
		"syncToken": data["syncToken"],
		"createDate": data["createDate"]
	}
}

const HEADER = [
	"IPV",
	"REGION",
	"NETGRP",
	"SERVICE",
	"NET",
	"CIDR",
	"SIZE"
]

function procPrefixes (ctx, data, opt, ipv, prefix_key, cidr_len_f) {
	let i, o, p, sep, net, cidr;

	for (i in data) {
		o = data[i];
		p = o[prefix_key];
		sep = p.search("/");
		net = p.substring(0, sep);
		cidr = parseInt(p.substring(sep + 1));

		ctx.csv.write([
			ipv,
			o["region"],
			o["network_border_group"],
			o["service"],
			net,
			cidr,
			cidr_len_f(cidr)
		]);
	}
}

function calcCidrLen (whole, cidr) {
	return BigInt(1) << BigInt(whole - cidr);
}


self.onmessage = async function (evt) {
	const ctx = {
		task_id: evt.data.task_id
	};
	const opt = evt.data.opt ? evt.data.opt : {
		"ipv4": true,
		"ipv6": true
	};

	try {
		ctx.csv = mkstringifier(ctx);

		const r = await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json');
		const json = await r.json()

		procMeta(ctx, json);

		ctx.csv.write(HEADER); // emit header

		if (opt["ipv4"]) {
			procPrefixes(
				ctx,
				json["prefixes"],
				opt,
				4,
				"ip_prefix",
				(cidr) => { return calcCidrLen(32, cidr) });
		}

		if (opt["ipv6"]) {
			procPrefixes(
				ctx,
				json["ipv6_prefixes"],
				opt,
				6,
				"ipv6_prefix",
				(cidr) => { return calcCidrLen(128, cidr) });
		}

		ctx.csv.end(); // The CSV string will be posted in the event handler
	}
	catch (e) {
		onerror(e, ctx);
	}
};
