const BITS = 8;
const INTMAX = (() => {
	let ret = 0;

	for (let i = 0; i < BITS; i += 1) {
		ret = (ret << 1) | 1
	}

	return ret;
})();
const STATE_DELAY_DEFAULT = 250;
const ANIMATIONS_DEFAULT = 'state-change 0.5s ease-in 0s 1';
let state_delay, animations;

function myParseInt (str) {
	let v, radix;

	if (str.startsWith("0b")) {
		v = str.substring(2);
		radix = 2;
	}
	else if (str.startsWith("0x")) {
		v = str.substring(2);
		radix = 16;
	}
	else if (str.startsWith("0")) {
		v = str.substring(1);
		radix = 1;
	}
	else {
		v = str;
		radix = 10;
	}

	if (v === '') {
		return 0;
	}

	return parseInt(v, radix);
}

function onOperandChange (val, span) {
	if (val.trim() === '') {
		span.style.opacity = 0;
	}
	else {
		const n = myParseInt(val);

		if (!(n <= INTMAX)) { // NaN is also handled with this single conditional
			span.style.opacity = 1;
		}
		else {
			span.style.opacity = 0;
		}
	}
}

function restartClassAnimation (element) {
	const evtOpts = { "once": true };

	// I fucking hate modern web development

	element.querySelectorAll('.state').forEach((element) => {
		element.style.animation = '';
	});
	element.querySelectorAll('.state-op tspan').forEach((element) => {
		element.style.animation = '';
	});
	element.querySelectorAll('.state').forEach((element) => {
		element.style.animation = animations;
		element.addEventListener('animationend', () => {
			element.style.animation = '';
		}, evtOpts);
		element.addEventListener('animationcancel', () => {
			element.style.animation = '';
		}, evtOpts);
	});
	element.querySelectorAll('.state-op tspan').forEach((element) => {
		element.style.animation = animations;
		element.addEventListener('animationend', () => {
			element.style.animation = '';
		}, evtOpts);
		element.addEventListener('animationcancel', () => {
			element.style.animation = '';
		}, evtOpts);
	});
}

class Renderer {
	reset () {}
	start (opr_a, opr_b, carry) {}
}
class MathRenderer extends Renderer {}
class AdderRenderer extends Renderer {}

class State {
	timer;
	outputList = [];

	addOutput (output_f) {
		this.outputList.push(output_f);
	}

	clearTimer () {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}

	startTimer (v, ms) {
		this.clearTimer();
		this.timer = setTimeout(() => {
			this.outputList.forEach((output_f) => {
				output_f(v)
			});
		}, ms);
	}

	detach () {
		this.clearTimer();
		this.outputList = null;
	}
}

class Register extends State {
	#elements;
	#txts = [];
	#bit = false;
	#onclick = null;

	constructor (elements, clickable = true) {
		super();
		const self = this;

		this.#elements = elements;

		this.#elements.forEach((e) => {
			const t = e.querySelector('text tspan');

			this.#txts.push(t);
			t.innerHTML = '0';
		});


		if (clickable) {
			this.#onclick = () => {
				self.value = !self.value;
			};

			this.#elements.forEach((e) => {
				e.style.cursor = 'pointer';
				e.addEventListener('click', this.#onclick);
			});
		}
	}

	get value () {
		return this.#bit;
	}

	set value (v_in) {
		const v = !!v_in;

		if (this.#bit == v) {
			return;
		}
		this.#bit = v;

		this.#elements.forEach((e) => {
			restartClassAnimation(e);
		});
		this.#txts.forEach((e) => {
			if (v) {
				e.innerHTML = '1';
			}
			else {
				e.innerHTML = '0';
			}
		});

		this.startTimer(v, state_delay);
	}

	detach () {
		super.detach();

		if (this.#onclick) {
			this.#elements.forEach((e) => {
				e.removeEventListener('click', this.#onclick);
			});

			this.#onclick = null;
		}

		this.#elements = null;
		this.#txts = null;
	}
}

class Adder extends State {
	#a = false;
	#b = false;
	#c = false;

	#update () {
		this.startTimer(this.value, state_delay);
	}

	set a (v_in) {
		this.#a = !!v_in;
		this.#update();
	}

	set b (v_in) {
		this.#b = !!v_in;
		this.#update();
	}

	set c (v_in) {
		this.#c = !!v_in;
		this.#update();
	}

	get value () {
		let sum = 0;

		if (this.#a) {
			sum += 1;
		}
		if (this.#b) {
			sum += 1;
		}
		if (this.#c) {
			sum += 1;
		}

		return {
			"a": this.#a,
			"b": this.#b,
			"ci": this.#c,
			"co": (sum & 2) > 0,
			"s": (sum & 1) > 0
		};
	}
}

function forEachBit (n, nb_bits, f) {
	let bit;

	for (let i = 0; i < nb_bits; i += 1) {
		bit = n & 1;
		f(bit > 0);

		n = n >> 1;
	}
}

function getLocalstorageData () {
	const item = localStorage.getItem('animations');

	if (item) {
		return JSON.parse(item);
	}
	else {
		return {
			"state-delay": STATE_DELAY_DEFAULT,
			"animations": ANIMATIONS_DEFAULT
		};
	}
}

function setLocalstorageData (obj) {
	localStorage.setItem('animations', JSON.stringify(obj));
}

function clearLocalstorageData () {
	localStorage.removeItem('animations');
}

function uploadLocalstorageData (elements) {
	state_delay = elements["state-delay"].value;
	animations = elements["animations"].value;
	setLocalstorageData({
		"state-delay": elements["state-delay"].value,
		"animations": elements["animations"].value
	});
}

function downloadLocalstorageData (elements) {
	const obj = getLocalstorageData();

	state_delay = elements["state-delay"].value = obj["state-delay"];
	animations = elements["animations"].value = obj["animations"];
}

window.addEventListener('load', async () => {
	const svg_math = document.getElementById("svg_the-math");
	const svg_adder = document.getElementById("svg_adder");
	const span_operand_a = document.getElementById("span_operand-a");
	const span_operand_b = document.getElementById("span_operand-b");
	const css_anim = await (await fetch('./anim.css')).text();

	// inject animation
	svg_math.contentDocument.getElementById('style1').innerHTML = css_anim;
	svg_adder.contentDocument.getElementById('style1').innerHTML = css_anim;

	let stateList = [];
	let adders;
	let registerCarry;
	let registerA;
	let registerB;
	let registerS;
	let carryState;

	function doReset () {
		stateList.forEach((s) => {
			s.detach();
		});
		stateList = [];
		adders = [];
		registerCarry = [];
		registerA = [];
		registerB = [];
		registerS = [];
		carryState = null;
		carry0 = null;

		// carryState
		(() => {
			const eMath = svg_math.contentDocument.getElementById('carry-ovf');
			const eAdder = svg_adder.contentDocument.getElementById('ovf');

			carryState = new Register([ eMath, eAdder ]);
			stateList.push(carryState);
		})();

		// registerS
		for (let i = 0; i < BITS; i += 1) {
			const eMath = svg_math.contentDocument.getElementById('result-' + i);
			const eAdder = svg_adder.contentDocument.getElementById('8-bit-register-c-' + i);
			const r = new Register([ eMath, eAdder ], false);

			stateList.push(r);
			registerS.push(r);
		}

		// registerCarry
		for (let i = 1; i <= BITS - 1; i += 1) {
			const eMath = svg_math.contentDocument.getElementById('carry-' + i);
			const eAdder = svg_adder.contentDocument.getElementById('carry-' + (i - 1));
			const r = new Register([ eMath, eAdder ], false);

			stateList.push(r);
			registerCarry.push(r);
		}
		registerCarry.push(carryState);

		// carry0
		const carry0element = svg_math.contentDocument.getElementById('carry-0');
		carry0 = new Register([ carry0element ]);
		carry0.addOutput((v) => {
			adders[0].c = v;
		});
		stateList.push(carry0);

		// adders
		for (let i = 0; i < BITS; i += 1) {
			const a = new Adder();

			a.addOutput((v) => {
				registerS[i].value = v['s'];
				registerCarry[i].value = v['co'];
			});
			adders.push(a);
			stateList.push(a);
		}
		for (let i = 1; i < BITS; i += 1) {
			adders[i - 1].addOutput((v) => {
				adders[i].c = v['co'];
			});
		}

		// registerA
		for (let i = 0; i < BITS; i += 1) {
			const eMath = svg_math.contentDocument.getElementById('operand-a-' + i);
			const eAdder = svg_adder.contentDocument.getElementById('8-bit-register-a-' + i);
			const r = new Register([ eMath, eAdder ]);

			r.addOutput((v) => {
				adders[i].a = v;
			});
			stateList.push(r);
			registerA.push(r);
		}

		// registerB
		for (let i = 0; i < BITS; i += 1) {
			const eMath = svg_math.contentDocument.getElementById('operand-b-' + i);
			const eAdder = svg_adder.contentDocument.getElementById('8-bit-register-b-' + i);
			const r = new Register([ eMath, eAdder ]);

			r.addOutput((v) => {
				adders[i].b = v;
			});
			stateList.push(r);
			registerB.push(r);
		}
	}

	doReset();

	const txt_operand_a = document.getElementById("txt_operand-a");
	const txt_operand_b = document.getElementById("txt_operand-b");
	const radio_op_add = document.getElementById("radio_op-add");
	const radio_op_adc = document.getElementById("radio_op-adc");
	const txt_state_animations = document.getElementById("txt_state-animations");
	const txt_state_change_delay = document.getElementById("txt_state-change-delay");
	const btn_animation_defaults = document.getElementById("btn_animation-defaults");

	document.getElementById("btn_exec").addEventListener('click', () => {
		const a = myParseInt(txt_operand_a.value);
		const b = myParseInt(txt_operand_b.value);
		let c;

		if (isNaN(a) || isNaN(b)) {
			return;
		}
		let i;

		function setRegisters () {
			i = 0;
			forEachBit(a, BITS, (v) => {
				registerA[i].value = v;
				i += 1;
			});
			i = 0;
			forEachBit(b, BITS, (v) => {
				registerB[i].value = v;
				i += 1;
			});
		}

		if (radio_op_add.checked) {
			setRegisters();
			c = (a + b) & INTMAX;
		}
		else if (radio_op_adc.checked) {
			carry0.value = carryState.value;
			setRegisters();
			c = (a + b + (carryState.value ? 1 : 0)) & INTMAX;
		}

		txt_operand_a.value = c;
	});

	document.getElementById("btn_reset").addEventListener('click', () => {
		doReset();
	});

	txt_operand_a.addEventListener('change', (evt) => {
		onOperandChange(evt.target.value, span_operand_a);
	});
	txt_operand_b.addEventListener('change', (evt) => {
		onOperandChange(evt.target.value, span_operand_b);
	});

	const animations_conf_elements = {
		"animations": txt_state_animations,
		"state-delay": txt_state_change_delay
	};
	downloadLocalstorageData(animations_conf_elements);

	txt_state_animations.addEventListener('change', () => {
		uploadLocalstorageData(animations_conf_elements);
	});
	txt_state_change_delay.addEventListener('change', () => {
		uploadLocalstorageData(animations_conf_elements);
	});
	btn_animation_defaults.addEventListener('click', () => {
		clearLocalstorageData();
		downloadLocalstorageData(animations_conf_elements);
	});
});
