(function(document, window){
	/*class find*/
	function find(el = null) {
	  if (el === null) return
	  this.element = (typeof el === 'object') ? el : document.querySelector(el)

	  this.css = function(styles, add = false) {
	    this.style = add ? this.element.getAttribute('style') : ''
	    if (typeof styles === 'object') {
	      for (var style in styles) {
	        this.style += style + ':' + styles[style] + ';'
	      }
	      this.element.setAttribute('style', this.style)
	      return this
	    } else {
	      return
	    }
	  }
	}

	find.prototype.html = function(html = null){
		if(html == null) return this.html
		this.element.innerHTML = html
		return this
	}


	find.prototype.append = function(tag = null, attrs) {
		if (tag == null) return
			var newOne = document.createElement(tag)
			this.element.appendChild(newOne)
			if (typeof attrs === 'object') {
				if(typeof attrs.id !== 'undefined')
			   		newOne.setAttribute('id', attrs.id)
				if(typeof attrs.html !== 'undefined')
				    newOne.innerHTML = attrs.html
				if(typeof attrs.class !== 'undefined')
				    newOne.setAttribute('class', attrs.class)
				if(typeof attrs.style !== 'undefined'){
				    var myStyle = ''
				    for (var style in attrs.style) {
				      myStyle += style + ':' + attrs.style[style] + ';'
				    }
			    	newOne.setAttribute('style', myStyle)
				}
			}
	  return newOne
	}

	find.prototype.appendChild = function(tag = null, attrs) {
		if (tag == null) return
			var newOne = document.createElement(tag)
			this.element.parentNode.insertBefore(newOne, this.element)
			if (typeof attrs === 'object') {
				for(var attr in attrs){
					newOne.setAttribute(attr, attrs[attr])
				}
			}
	  return newOne
	}

	class Canvas{
		constructor(element){
			// this.canvas = document.querySelector(element);
			this.parent = element
			this.canvas = element.appendChild(document.createElement('canvas'))
			
			this.canvas.width = element.dataset.width
			
			this.canvas.height = element.dataset.height
			
			this.textcolor = this.parent.dataset.color
			this.fillboxcolor = this.parent.dataset.fillboxcolor
			this.strokecolor = this.parent.dataset.strokecolor
			this.labels = this.parent.dataset.labels

			this.width = this.canvas.width
			this.height = this.canvas.height
			this.ctx = this.canvas.getContext("2d");
		}
		clear(){
			this.ctx.clearRect(0,0, this.width, this.height);
			return this;
		}
	}


	Array.prototype.fillToBin = function(to = 8) {
		if(this.length < to){
			var len = this.length
			var vals = this.slice(0, this.length)
			this.length = 0
			for(var i = 0; i < (to - len); i ++)
				this.push('0')

			return this.concat(vals)
		}
		return this
	};


	Array.prototype.cutInHalf = function(){
		var len = this.length
		var part1 = this.slice(0,this.length/2)
		var part2 = this.slice(this.length/2, this.length)
		return [part1, part2]
	}





	function dec2Bin(dec, toArray = true){
	    if(dec >= 0)
	        return toArray?dec.toString(2).split(''):dec.toString(2);
	    return toArray?(~dec).toString(2).split(''):(~dec).toString(2);
	}


	window.binaryClock = function(passed){
		var canvas = new Canvas(new find('.binaryClock')
			.appendChild('div', {
				'data-width': passed.width,
				'data-height':passed.height,
				'data-labels':passed.labels,
				'data-color':passed.labelcolor,
				'data-strokecolor':passed.emptybitcolor,
				'data-fillboxcolor':passed.filledbitcolor
			}));
			
		canvas.canvas.onclick = function(){
			window.open('https://bichiko.github.io/binary-clock/', '_blank')
		}
		canvas.canvas.style.cursor='pointer'

		var ctx  = canvas.ctx

		new find(canvas.parent).css({'position':'relative', 'margin':'auto'})

		var bottomTextArray = new Array()
		var rightBinaryArray = new Array()

		function mainloop(){
			canvas.clear()

			var date = new Date();
			var Hours = date.getHours()
			var Minutes = date.getMinutes()
			var Seconds = date.getSeconds()
			var hh = Hours < 10 ? Hours + '0' : Hours
			var mm = Minutes < 10 ? Minutes + '0' : Minutes
			var ss = Seconds < 10 ? Seconds + '0' : Seconds

			// console.log(hh+":"+mm+":"+ss)

			canvas.title = hh+":"+mm+":"+ss 


			hhp = [parseInt( hh / 10 ), hh % 10]
			mmp = [parseInt( mm / 10 ), mm % 10]
			ssp = [parseInt( ss / 10 ), ss % 10]
			var binArray = (hhp.concat(mmp)).concat(ssp)
			binArray = binArray.map(x => dec2Bin(x))
			for( var i = 0; i < binArray.length; i ++){
				binArray[i] = binArray[i].fillToBin(4)
			}
		 	
		 	ctx.fillStyle = canvas.fillboxcolor
		 	ctx.strokeStyle = canvas.strokecolor

			var marginTop = canvas.height / binArray[0].length
			var marginLeft = canvas.width / binArray.length
			var width = canvas.width / (binArray.length * 2)
			var height = canvas.height / (binArray[0].length * 2)
			for(var y = 0; y < binArray[0].length; y += 1){
				for(var x = 0; x < binArray.length; x += 1){
					if(binArray[x][y] == '0')
						ctx.strokeRect(x*marginLeft + width/2, y*marginTop + height/2, width, height);	
					else
						ctx.fillRect(x*marginLeft + width/2, y*marginTop + height/2, width, height);	
				}
			}



			if(canvas.labels == 'true'){
				for(var index = 0; len = bottomTextArray.length, index < len; index ++){
					// console.log(bottomTextArray[index])
					// console.log(bottomTextArray[index].parentNode)
					bottomTextArray[index].parentNode.removeChild(bottomTextArray[index])
				}
				bottomTextArray = []
				if(bottomTextArray.length == 0){
					for(var i = 0; i < 3; i ++){
						bottomTextArray.push(new find(canvas.parent).append('div', {
								id: 'bottomTextDiv',
								style: {
									'height':'auto',
									'font-weight':'bold',
									'font-size': width+'px',
									'position':'absolute',
									'color': canvas.textcolor,
									'text-align':'center',
									'left': i * (canvas.width / 3) + width/2+'px',
									'width': (canvas.width / 3) - width +'px',
									'top': canvas.height+'px'
								},
								html: (i==0?'HH':(i==1?'MM':'SS'))
							})
						);	
					}
				}

				for(var index = 0; len = rightBinaryArray.length, index < len; index ++){
					rightBinaryArray[index].parentNode.removeChild(rightBinaryArray[index])
				}
				rightBinaryArray = []
				if(rightBinaryArray.length == 0){
					for(var i = 0; i < 4; i ++){
						rightBinaryArray.push(new find(canvas.parent).append('div', {
								id: 'rightTextDiv',
								style: {
									'height':'auto',
									'font-weight':'bold',
									'font-size': height+'px',
									'position':'absolute',
									'color': canvas.textcolor,
									'width':'auto',
									'vertical-align':'middle',
									'top': i * (canvas.height / 4) + height/2+'px',
									'height': (canvas.height / 4) - height +'px',
									'line-height': (canvas.height / 4) - height +'px',
									'left': canvas.width+'px'
								},
								html: (i==0?'8':(i==1?'4':(i==2?'2':'1')))
							})
						);	
					}
				}
			}
			

			canvas.parent.style.width = canvas.width + (canvas.labels=='true'?((width>height?height:width)*2):'') + 'px'
			canvas.parent.style.height = canvas.height + (canvas.labels=='true'?((width>height?height:width)*2):'') + 'px'

		}
		mainloop()
		var clockTimer = setInterval(mainloop, 1000);


		this.stop = function(){
			clearInterval(clockTimer)
		}
		this.remove = function(){
			this.stop()
			canvas.parent.parentNode.removeChild(canvas.parent)
		}
		this.srcRemove = function(){
			this.stop()
			this.remove()
			new find('.binaryClock').element.parentNode.removeChild(new find('.binaryClock').element)
		}
	}

	window.find = function(e){
		return new find(e)
	}

})(document, window);

