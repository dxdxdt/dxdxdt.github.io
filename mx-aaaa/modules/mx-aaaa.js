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
export class Resolver {
	async resolve (type, rname) {} // abstract
};

function getRTypeNum (typestrd) {
	switch (typestrd) {
	case 'A': return 1;
	case 'AAAA': return 28;
	case 'MX': return 15;
	}
	throw new Error();
}

export class GooglePublicDNSResolver {
	_mk_query_url (type, rname) {
		return `https://dns.google/resolve?name=${rname}&type=${type}`;
	}

	async _resolve_inner (url) {
		let rsp;

		for (let i = 0; i < 3; i += 1) {
			rsp = await fetch(url);

			if (rsp.status / 100 === 5) {
				await new Promise(r => setTimeout(r, 500));
				continue;
			}
			break;
		}

		return rsp;
	}

	async resolve (type, rname) {
		if (!rname.endsWith('.')) {
			rname += '.';
		}
		const url = this._mk_query_url(type, rname);
		const rsp = await this._resolve_inner(url);
		const doc = await rsp.json();
		const nrtype = getRTypeNum(type);
		let ret = [];

		if ('Answer' in doc) {
			for (const rr of doc['Answer']) {
				// ignore other extra answers like CNAME
				if ('data' in rr &&
					'name' in rr &&
					'type' in rr &&
					rr['name'] === rname &&
					rr['type'] === nrtype)
				{
					ret.push(rr['data']);
				}
			}
		}

		return ret;
	}
};

export function parseList (txt) {
	let ret = [];
	const lines = txt.split(/[\r\n]+/gm);

	for (let l of lines) {
		l = l.trim();

		const d = l.search('#');
		if (d >= 0) {
			l = l.substring(0, d).trim();
		}

		if (l) {
			ret.push(l);
		}
	}

	return ret;
};

const defaultResolver = GooglePublicDNSResolver;

export class ResolveMXAAAA {
	constructor (onresolve) {
		this.onresolve = onresolve;
	}

	async doResolve (list, resolver = null) {
		let ret = {
			mxmap: {},
			counts: {
				list: list.length,
				mx: 0,
				has_a: 0,
				has_aaaa: 0
			}
		};

		if (!resolver) {
			resolver = new defaultResolver();
		}

		// init the map
		for (const domain of list) {
			ret.mxmap[domain] = {
				mx: [],
				amap: {},
				acnt: 0,
				aaaamap: {},
				aaaacnt: 0
			};
		}

		// Get all MX
		let i = 0;
		for (const domain of list) {
			const q_mx = await resolver.resolve('MX', domain);
			let has_a = 0, has_aaaa = 0;

			this.onresolve('start', { domain: domain }, ret);

			for (let mx of q_mx) {
				// don't need the number part
				const d = mx.search(/\s+/);
				if (d > 0) {
					mx = mx.substring(d).trim();
				}

				ret.mxmap[domain].mx.push(mx);
				ret.counts.mx += 1;

				this.onresolve('mx', {
					domain: domain,
					mx: mx
				}, ret);

				// Resolve all A of MX
				const q_a = await resolver.resolve('A', mx);
				if (q_a.length) {
					has_a = 1;
					ret.mxmap[domain].acnt += 1;
				}
				ret.mxmap[domain].amap[mx] = q_a;
				this.onresolve('a', {
					domain: domain,
					mx: mx,
					a: q_a
				}, ret);

				// Resolve all AAAA of MX
				const q_aaaa = await resolver.resolve('AAAA', mx);
				if (q_aaaa.length) {
					has_aaaa = 1;
					ret.mxmap[domain].aaaacnt += 1;
				}
				ret.mxmap[domain].aaaamap[mx] = q_aaaa;
				this.onresolve('aaaa', {
					domain: domain,
					mx: mx,
					aaaa: q_aaaa
				}, ret);
			}

			ret.counts.has_a += has_a;
			ret.counts.has_aaaa += has_aaaa;
			i += 1;

			this.onresolve('end', {
				domain: domain,
				progress: {
					cur: i,
					cnt: list.length
				}
			}, ret);
		}

		return ret;
	}
};
