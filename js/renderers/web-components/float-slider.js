const template = document.createElement('template')
template.innerHTML = `
            <style>
                .container {
                }
                .float-slider-container {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                }
                .start, .end {
                    flex: 1;
                }
                .start {
                    text-align: right;
                }
                .in {
                    flex: 3;
                }
                .currentValue {
                    width: 100%;
                    margin: 0 auto;
                    text-align: center;
                }
            </style>
            <div class="container">
                <slot></slot>
                <div class="currentValue"></div>
                <div class="float-slider-container">
                    <label class="start"></label>
                    <input class="in" type="range" 
                        value="" 
                        min="" 
                        max=""
                        step="any"
                        >
                    <label class="end"></label>            
                </div>  
            </div>
`

class FloatSlider extends HTMLElement {
    static handledAttributes = [
        'min',
        'max',
        'value'
    ]

    constructor() {
        super();
        this.refresh()
        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // this.appendChild(this.template);
        this.getAllAttributes()
        this.start = this.shadowRoot.querySelector('.start')
        this.end = this.shadowRoot.querySelector('.end')
        this.value = this.shadowRoot.querySelector('.currentValue')
        this.input = this.shadowRoot.querySelector('.in')
        console.log('slider initialising',
            this.start,
            this.end,
            this.value,
            this.input,
        )

        this.start.innerText = this.getAttribute('start')

        console.log('slider managed attributes', FloatSlider.handledAttributes)
        this.input.addEventListener('change', (event) => {
            console.log('change', event.target.value)
            this.updateValue(event.target.value)
        })
        this.input.addEventListener('input', (event) => {
            console.log('input', event.target.value)
            this.updateValue(event.target.value)
        })

        console.log('slider initialised', this)

    }

    refresh() {
    }

    static get observedAttributes() {
        return this.handledAttributes
    }

    updateValue(value) {
        this.value.innerHTML = parseFloat(value).toFixed(2)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, 'changed', oldValue, newValue)
        if (name === 'value')
            this.updateValue(newValue)
        if (name === 'min') {
            this.start.innerHTML = newValue
            this.input.setAttribute('min', newValue)
        }
        if (name === 'max') {
            this.end.innerHTML = newValue
            this.input.setAttribute('max', newValue)
        }

    }

    getAllAttributes() {
        for (let a of this.getAttributeNames()) {
            this[a] = this.getAttribute(a)
            if (FloatSlider.handledAttributes.indexOf(a) === -1)
                FloatSlider.handledAttributes.push(a)
        }
        console.log('handled attributes', FloatSlider.handledAttributes)
    }
}

customElements.define("edi-float-slider", FloatSlider);

