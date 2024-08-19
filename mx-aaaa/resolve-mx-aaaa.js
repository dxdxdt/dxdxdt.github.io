import {parseList, ResolveMXAAAA} from './modules/mx-aaaa.js';

const rt_status = document.getElementById('status');
const rt_cardHolder = document.getElementById('card-holder');
const rt_output = document.getElementById('output');
const i_txtlist = document.getElementById('txtlist');
const rt_hlist = document.getElementById('hlist');

let progressCounter = 0;
let progress = {
	cur: 0,
	cnt: 0
};

function doProgressRender () {
	const dots = '.'.repeat(progressCounter);
	let progressStr;

	if (progress.cnt > 0) {
		const percent = (progress.cur / progress.cnt * 100).toFixed(2);
		progressStr = `(${progress.cur}/${progress.cnt} ${percent})`;
	}
	else {
		progressStr = '';
	}
	rt_status.innerText = `in progress ${progressStr} ${dots}`;
	progressCounter = (progressCounter + 1) % 4;
}

function onresolvereducer (what, obj, map) {
	try {
		const cnt_mx = map.mxmap[obj.domain].mx.length;
		const cnt_a = map.mxmap[obj.domain].acnt;
		const cnt_aaaa = map.mxmap[obj.domain].aaaacnt;

		function determineCard () {
			if (cnt_mx === 0) {
				return;
			}
			else if ((cnt_a > 0 && cnt_mx !== cnt_a) ||
					(cnt_aaaa > 0 && cnt_mx !== cnt_aaaa))
			{
				return 'redDomainCard';
			}
			else if (cnt_aaaa > 0) {
				if (cnt_a > 0) {
					return 'greenDomainCard';
				}
				else {
					return 'magentaDomainCard';
				}
			}
			else if (cnt_a > 0) {
				return 'yellowDomainCard';
			}
			else {
				return 'redDomainCard';
			}
		}

		const cardId = `resolve-mx-card-${obj.domain}`;
		const card = document.getElementById(cardId);
		const statusLine = card.getElementsByClassName('domainStatus')[0];

		statusLine.innerText = `mx: ${cnt_mx}, a: ${cnt_a}, aaaa: ${cnt_aaaa}`;

		if (what === 'end') {
			const d = determineCard();

			if (d) {
				card.classList = `domainCard ${d}`;
			}
			progress = obj.progress;
		}
	}
	catch (e) {
		console.error(e);
	}
	finally {
		console.log(what + ': ' + JSON.stringify(obj) + '\n');
	}
}

function initCards (list) {
	for (const domain of list) {
		const subtitle = document.createElement('p');
		subtitle.className = 'domainSubtitle';
		subtitle.innerText = domain;

		const statusLine = document.createElement('span');
		statusLine.className = 'domainStatus';
		statusLine.innerText = 'mx: 0, a: 0, aaaa: 0';

		const card = document.createElement('div');
		card.classList = 'domainCard beigeDomainCard';
		card.id = `resolve-mx-card-${domain}`;

		rt_cardHolder.appendChild(card);
		card.appendChild(subtitle);
		card.appendChild(statusLine);
	}
}

new Promise(async function () {
	const progressRenderTimer = setInterval(doProgressRender, 500);

	doProgressRender();

	try {
		let txt = localStorage.getItem("domains");

		if (txt) {
			i_txtlist.innerText = txt;
			rt_hlist.innerText = 'List *(from localStorage)';
		}
		else {
			const rsp = await fetch('./domains.txt');
			i_txtlist.innerText = txt = await rsp.text();
			rt_hlist.innerText = 'List';
		}

		const list = parseList(txt);
		const m = new ResolveMXAAAA(onresolvereducer);

		initCards(list);

		const result = await m.doResolve(list);
		const percent = (result.counts.has_aaaa / result.counts.mx * 100).toFixed(2);

		rt_status.innerText = `SUCCESS: ${result.counts.has_aaaa} of ${result.counts.mx} service providers have AAAA (${percent}%)`;
		rt_output.innerText += JSON.stringify(result, null, '\t');
	}
	catch (e) {
		rt_status.innerText = "ERROR: " + e;
		throw e;
	}
	finally {
		clearInterval(progressRenderTimer);
	}
});


document.getElementById('btn-listapply').onclick = function () {
	localStorage.setItem("domains", i_txtlist.innerText);
	location.reload();
};

document.getElementById('btn-listreset').onclick = function () {
	localStorage.removeItem("domains");
	location.reload();
};
