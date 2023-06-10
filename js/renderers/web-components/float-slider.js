const template = document.createElement('template')
template.innerHTML = `
            <link rel="stylesheet" href="css/bootstrap.css">
            <style>
                .container {
                    margin-bottom: 22px;
                    width: 100%;
                }
                .start {
                    text-align: right;
                }
                .end {
                    text-align: left;
                }
            </style>
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center currentValue"></div>
                </div>
                <div class="row">
                    <div class="col-md-2 start"></div>
                    <div class="col-md-8 center-block">
                        <input class="in" type="range" 
                            value="" 
                            min="" 
                            max=""
                            step=""
                        >
                    </div>
                    <div class="col-md-2 end"></div>
                </div>
            </div>
<!--
            <div class="container">
                <div class="float-slider-container">
                    <div class="currentValue"></div>
                    <label class="start"></label>
                    <input class="in" type="range" 
                        value="" 
                        min="" 
                        max=""
                        step=""
                        >
                    <label class="end"></label>            
                </div>  
                <br>
                <br>
                <br>
                <br>
            </div>
-->
`

class FloatSlider extends HTMLElement {
    static handledAttributes = [
        'min',
        'max',
        'step',
        'value'
    ]

    constructor() {
        super();
        this.refresh()
        this.attachShadow({mode: "open"});

        // this.append(template.content.cloneNode(true))
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // this.innerHtml = template.content.cloneNode(true)
        // this.appendChild(this.template);

        this.getAllAttributes()
        /*
                this.start = this.getRootNode().querySelector('.start')
                this.end = this.getRootNode().querySelector('.end')
                this.value = this.getRootNode().querySelector('.currentValue')
                this.input = this.getRootNode().querySelector('.in')
        */
        this.start = this.shadowRoot.querySelector('.start')
        this.end = this.shadowRoot.querySelector('.end')
        this.currentValue = this.shadowRoot.querySelector('.currentValue')
        this.input = this.shadowRoot.querySelector('.in')
        console.log('slider initialising',
            this.start,
            this.end,
            this.currentValue,
            this.input,
        )

        this.start.innerText = this.getAttribute('start')
        this.input.setAttribute('step', this.step)
        this.input.setAttribute('min', this.min)
        this.input.setAttribute('max', this.max)
        this.input.setAttribute('value', this.value)

        console.log('slider managed attributes', FloatSlider.handledAttributes)
        this.input.addEventListener('change', (event) => {
            console.log('change', event.target.value)
            this.updateValue(event.target.value)
            this.setAttribute('value', event.target.value)

        })
        this.input.addEventListener('input', (event) => {
            console.log('input', event.target.value)
            this.updateValue(event.target.value)
            this.setAttribute('value', event.target.value)
        })

        console.log('slider initialised', this)

    }

    refresh() {
    }

    static get observedAttributes() {
        return this.handledAttributes
    }

    updateValue(value) {
        this.currentValue.innerHTML = parseFloat(value).toFixed(2)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, 'changed', oldValue, newValue)
        if (name === 'value')
            this.updateValue(newValue)
        if (name === 'step') {
            this.input.setAttribute('step', newValue)
        }
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

