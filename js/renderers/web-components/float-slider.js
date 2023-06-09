const template = document.createElement('template')
template.innerHTML = `
            <style>
                .container {
                    margin-bottom: 22px;
                }
                .start {
                    text-align: right;
                }
                .end {
                    text-align: left;
                }
                /*
                .float-slider-container {
                    display: grid;
                    grid-template-rows: 20px 20px;
                    grid-template-columns: 10px 1fr 10px;
                    !*
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    justify-content: center;
                    margin-bottom: 100px;
                    gap: 100px;
                    *!
                }
                .start, .end {
                    // flex: 1;
                    grid-row-start: 2;
                    grid-row-end: 2;
                }
                .start {
                    grid-column-start: 1;
                    grid-column-end: 1;
                    text-align: right;
                }
                .end {
                    grid-column-start: 3;
                    grid-column-end: 3;
                    text-align: right;
                }
                .in {
                    grid-column-start: 2;
                    grid-column-end: 2;
                    grid-row-start: 2;
                    grid-row-end: 2;
                    !*flex: 5;*!
                }
                .currentValue {
                    width: 100%;
                    margin: 0 auto;
                    text-align: center;
                    grid-column-start: 2;
                    grid-column-end: 2;
                    grid-row-start: 1;
                    grid-row-end: 1;
                    flex: 5;
                }
                */
            </style>
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center currentValue"></div>
                </div>
                <div class="row">
                    <div class="col-md-2 start"></div>
                    <div class="col-md-8 center-block in">
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
        // this.attachShadow({mode: "open"});

        // this.shadowRoot.appendChild(template.content.cloneNode(true));
        // this.innerHtml = template.content.cloneNode(true)
        // this.appendChild(this.template);
        this.append(template.content.cloneNode(true))

        this.getAllAttributes()
        this.start = this.getRootNode().querySelector('.start')
        this.end = this.getRootNode().querySelector('.end')
        this.value = this.getRootNode().querySelector('.currentValue')
        this.input = this.getRootNode().querySelector('.in')
/*
        this.start = this.shadowRoot.querySelector('.start')
        this.end = this.shadowRoot.querySelector('.end')
        this.value = this.shadowRoot.querySelector('.currentValue')
        this.input = this.shadowRoot.querySelector('.in')
*/
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

