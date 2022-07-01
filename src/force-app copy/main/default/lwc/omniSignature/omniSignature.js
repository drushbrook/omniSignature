/**
  This custom LWC can be used in a OmniScript to capture a signature.
  Code was adapted from the following example found on the internet.  
  
  @see https://lenguyensf.blog/2020/07/30/lwc-capture-signature-using-canvas/

  
  @author Derek Cassese - dcassese@salesforce.com
  @version 1.0
 
  History
  =======
  July 1, 2022 - v1.0 - Initial Version
  
  Configuration
  =============
  Set the following custom LWC properties for this component

  debug                  - show extra debug information in the browser console (Optional, Default = false)

  Notes
  =====
  

 */


import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';


let sCanvas , context; 
let mDown = false;
let mPos = {
    x:0,
    y:0
};
let lastPos = {
    x:0,
    y:0
};

export default class OmniSignature extends OmniscriptBaseMixin(LightningElement) {

    @api debug = false;
 
    constructor(){
        super();
        this.template.addEventListener('mousedown',this.handleMousedown.bind(this));
        this.template.addEventListener('mouseup',this.handleMouseup.bind(this));
        this.template.addEventListener('mousemove',this.handleMousemove.bind(this));
        this.template.addEventListener('mouseout',this.handleMouseend.bind(this));
        
    }
 
    renderedCallback(){
        sCanvas = this.template.querySelector('canvas');
        context = sCanvas.getContext('2d'); 
        context.strokeStyle = "#757575";
        context.lineWidth = 3;
    }

    handleMousedown(evt){
        evt.preventDefault();
        mDown = true;
        this.getPos(evt);
         
    }
 
    handleMouseup(evt){
        evt.preventDefault();
        mDown = false;
    }
 
    handleMousemove(evt){
        evt.preventDefault();
        if(mDown){
            this.getPos(evt);
            this.draw();
        }
    }
 
    getPos(evt){
        let cRect = sCanvas.getBoundingClientRect();
        lastPos = mPos;
        mPos = {x:(evt.clientX - cRect.left),y:(evt.clientY - cRect.top)};
    }
 
    handleMouseend(evt){
        evt.preventDefault();
        mDown = false;
    }
 
    draw(){
        context.beginPath();
        context.moveTo(lastPos.x,lastPos.y);
        context.lineCap = 'round';
        context.lineTo(mPos.x,mPos.y);
        context.closePath();
        context.stroke();
    }
 
    handleClear(){
        context.clearRect(0,0,sCanvas.width,sCanvas.height);
    }

    handleSaveSignature(evt){
         
        context.globalCompositeOperation  = "destination-over";
        context.fillStyle  = "#FFF";
        context.fillRect(0,0,sCanvas.width,sCanvas.height);
        
        let imageURL = sCanvas.toDataURL('image/png');
        let imageData = imageURL.replace(/^data:image\/(png|jpg);base64,/, "");
        if (this.debug)  console.log("image:  "+ imageData);
        super.omniUpdateDataJson({"imageData":imageData});
        
    }
}