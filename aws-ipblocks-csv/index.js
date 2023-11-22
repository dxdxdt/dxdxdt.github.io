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

var worker;
var ui = {
	f: {}
};
var url;

function onerror (e) {
	console.log(e);

	ui.working.innerHTML = e.toString();
	ui.working.className = "error";
}

function onmessage (evt) {
	let blob, url, dlname = [];

	ui.f.submit.disabled = false;

	if (evt.data.error) {
		onerror(evt.data.error);
		return;
	}

	dlname.push("aws-ip_");
	dlname.push(evt.data.meta["createDate"]);
	dlname.push("_");
	dlname.push(evt.data.meta["syncToken"]);
	dlname.push(".csv");

	if (url) {
		URL.revokeObjectURL(url);
	}

	blob = new Blob([ evt.data.payload ], { type: "text/csv" });
	url = URL.createObjectURL(blob);

	ui.working.className = "";
	ui.working.innerHTML = "Done!";

	ui.savelink.className = "";
	ui.savelink.href = url;
	ui.savelink.download = dlname.join("");
}

function do_load () {
	ui.working = document.getElementById("working-indicator");
	ui.f.ipv4 = document.form.ipv4;
	ui.f.ipv6 = document.form.ipv6;
	ui.f.submit = document.form.submit;
	ui.savelink = document.getElementById("save-link");

	worker = new Worker("worker.js", { type: "module" });
	worker.onmessage = onmessage;
}

function do_submit () {
	try {
		if (!(ui.f.ipv4.checked || ui.f.ipv6.checked)) {
			throw "Not pulling anything? (both v4 and v6 unchecked)";
		}

		worker.postMessage({
			task_id: "null",
			opt: {
				"ipv4": ui.f.ipv4.checked,
				"ipv6": ui.f.ipv6.checked
			}
		});

		ui.f.submit.disabled = true;
		ui.working.className = "working-animated";
		ui.working.innerHTML = "Working ...";
	}
	catch (e) {
		onerror(e);
	}

	return false;
}
