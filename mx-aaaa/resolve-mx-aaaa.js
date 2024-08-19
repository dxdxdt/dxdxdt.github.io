import {parseList, ResolveMXAAAA} from './modules/mx-aaaa.js';

const rt_status = document.getElementById('status');
const rt_cardHolder = document.getElementById('card-holder');
const rt_output = document.getElementById('output');
const i_txtlist = document.getElementById('txtlist');
const rt_hlist = document.getElementById('hlist');

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
				return ['redDomainCard', 'some mx missing'];
			}
			else if (cnt_aaaa > 0) {
				if (cnt_a > 0) {
					return ['greenDomainCard', 'dual stack'];
				}
				else {
					return ['magentaDomainCard', 'ipv6 only'];
				}
			}
			else if (cnt_a > 0) {
				return ['yellowDomainCard', 'ipv4 only'];
			}
			else {
				return ['redDomainCard', 'no a or aaaa'];
			}
		}

		const cardId = `resolve-mx-card-${obj.domain}`;
		const card = document.getElementById(cardId);
		const statusLine = card.getElementsByClassName('domainStatus')[0];

		statusLine.innerText = `mx: ${cnt_mx}, a: ${cnt_a}, aaaa: ${cnt_aaaa}`;
		switch (what) {
		case 'a':
		case 'aaaa':
			const d = determineCard();
			if (d) {
				card.classList = `domainCard ${d[0]}`;
				statusLine.innerText += ` (${d[1]})`;
			}
			break;
		}

	}
	catch (e) {
		console.error(e);
	}
	finally {
		rt_output.innerText += what + ': ' + JSON.stringify(obj) + '\n';
	}
}

function initCards (list) {
	for (const domain of list) {
		const subtitle = document.createElement('p');
		subtitle.className = 'domainSubtitle';
		subtitle.innerText = domain;

		const statusLine = document.createElement('span');
		statusLine.className = 'domainStatus';
		statusLine.innerText = 'mx: 0, a: 0, aaaa: 0 (pending)';

		const card = document.createElement('div');
		card.classList = 'domainCard redDomainCard';
		card.id = `resolve-mx-card-${domain}`;

		rt_cardHolder.appendChild(card);
		card.appendChild(subtitle);
		card.appendChild(statusLine);
	}
}

new Promise(async function () {
	let progressCounter = 0;
	function doProgressRender () {
		const dots = '.'.repeat(progressCounter);

		rt_status.innerText = 'in progress ' + dots;
		progressCounter = (progressCounter + 1) % 4;
	}

	doProgressRender();
	const progressRenderTimer = setInterval(doProgressRender, 500);

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
		rt_output.innerText += '\n';
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
