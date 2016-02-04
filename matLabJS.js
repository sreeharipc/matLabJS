


(function()
{

	
	//////////////////////////////////////////////////////////////////////////////////////////
	// sign,diff,abs,mean,sum,square,std,zeros,real,maxpos,minpos,range,conv,corr, 		    //	
	// hamming,dct,linspace,plot,conj,ifft,fft,butter,bitRevIndices,complexadd,complexmult, //
	// scalarmult,complexarray,twiddle,add,sub,mult,sin [computefly,log,setUpchart]         //
	//////////////////////////////////////////////////////////////////////////////////////////



	
	/**
	 * constructer for matLab
	 * @param  {object} opts contains context of canvas
	 */
	this.matLab = function(opts)
	{
		this.context = opts.context||null;
		this.chart =null;
		this.PI = Math.PI;
		console.log('functions available : ');
		console.log('sign,diff,abs,mean,sum,square,std,zeros,real,maxpos,minpos,range,conv,corr,hamming,dct,linspace,plot,conj,ifft,fft,butter,bitRevIndices,complexadd,complexmult,scalarmult,complexarray,twiddle,add,sub,mult,sin [computefly,log,setUpchart]');
	}

	//////////////////////
	//private functions //
	//////////////////////

	/**
	 * finds sign of elements in array
	 * @param  {object} array array of numbers
	 * @return {object}       array containing -1,1 or 0
	 */
	matLab.prototype.sign = function(array)
	{
		return array.map(Math.sign);//x -> Math.sign(x)
	}

	/**
	 * calculates difference between adjacent elements
	 * @param  {object} array array of numbers
	 * @return {object}       array containing difference values
	 */
	matLab.prototype.diff = function(array)
	{
		var temp=[];
		for(var i=0;i<array.length-1;i++)
		{
			temp[i]=array[i+1]-array[i];
		}
		return temp;
	}

	/**
	 * calculates absolute value of array of numbers or complex numbers
	 * @param  {object} array numbers or complex number array
	 * @return {object}       array containing corresponding absolute values
	 */
	matLab.prototype.abs = function(array)
	{
		if(typeof(array[0])=="object")
		{
			return array.map(function(val)
			{
				return Math.hypot(val[0],val[1]);
			});
		}
		else
		{
			return array.map(Math.abs);//x -> Math.abs(x)
		}
	}

	/**
	 * calculates mean of array elements
	 * @param  {object} array number array
	 * @return {number}       mean value
	 */
	matLab.prototype.mean = function(array)
	{
		return (this.sum(array)/array.length);
	}

	/**
	 * calculates sum of array elements	
	 * @param  {object} array number array
	 * @return {number}       sum
	 */
	matLab.prototype.sum = function(array)
	{
		var temp=0;
		for(var i=0;i<array.length;i++)
		{
			temp+=array[i];
		}
		return temp;
		//array.reduce((prev,cur) -> prev+cur);
	}

	/**
	 * calculates squares of array elements
	 * @param  {object} array number array
	 * @return {object}       number squared array
	 */
	matLab.prototype.square = function(array)
	{
		return array.map(function(x){return x*x;});
	}

	/**
	 * calculates standard deviation of array elements
	 * @param  {object} array number array
	 * @return {number}       standard deviation
	 */
	matLab.prototype.std = function(array)
	{
		var mean = this.mean(array);
		var variance = 0;
		var length = array.length;
		for(var i=0;i<length;i++)
		{
			variance+=Math.pow((array[i]-mean),2);
		}
		variance = variance/(length-1);
		return Math.sqrt(variance);
		
	}

	/**
	 * fills array of specified length with val
	 * @param  {number} num length of arrat needed
	 * @param  {number} val value to fillthe array with
	 * @return {object}     value filled array
	 */
	matLab.prototype.fill = function(num,val)
	{
		var array = [];
		var val = val||0;
		for(var i=0;i<num;i++)
		{
			array[i]=val;
		}
		return array;
	}

	/**
	 * provides real part of complex number
	 * @param  {object} array complex number array
	 * @return {object}       number array with real part
	 */
	matLab.prototype.real = function(array)
	{
			return array.map(function(val)
				{
					return val[0];
				});
	
	}

	/**
	 * provides imaginary part of complex number
	 * @param  {object} array complex number array
	 * @return {object}       number array with imaginary part
	 */
	matLab.prototype.imag = function(array)
	{
			return array.map(function(val)
				{
					return val[1];
				});
	}

	/**
	 * finds the maximum of array elements and returns maximum and maximum position
	 * @param  {object} array number array
	 * @return {object}       [max value,max position]
	 */
	matLab.prototype.maxpos = function(array)
	{
		var temp = Math.max.apply(null,array);
		return [temp,array.indexOf(temp)];
	}

	/**
	 * finds the minimum of array elements and returns maximum and maximum position
	 * @param  {object} array number array
	 * @return {object}       [min value,min position]
	 */
	matLab.prototype.minpos = function(array)
	{
		var temp = Math.min.apply(null,array);
		return [temp,array.indexOf(temp)];
	}

   	
   	/**
   	 * creates number array with starting value 'start', stopping value 'stop' and step as 'step'
   	 * @param  {number} start starting value
   	 * @param  {number} stop  stopping value (might be less than this value according to step)
   	 * @param  {number} step  step value (default 1)
   	 * @return {object}       created number array
   	 */
	matLab.prototype.range = function(start,stop,step)
	{
		if(start==stop)
		return [start];

		step = step||1;
		var array = [];
		for(var i=start,j=0;(step>0?i<=stop:i>=stop);i+=step,j++)
		{
			array[j] = i;
		}
		return array;
	}
	
	
	/**
	 * calculates convolution between two number arrays
	 * @param  {object} array1 first number array
	 * @param  {object} array2 second number array
	 * @return {object}        convolution result array
	 */
	matLab.prototype.conv = function(array1,array2)
	{
		var l = array1.length+array2.length-1,y=[];
		array1 = array1.concat(this.fill(l-array1.length));
		array2 = array2.concat(this.fill(l-array2.length));
		for(var n=0;n<l;n++)
		{
			y[n]=0;
			for(var k=0;k<=n;k++)
			{
				y[n]+=array1[k]*array2[n-k];
			}
		}
		return y;
	}

	/**
	 * calculates correlation between two number arrays (uses convolution as correlation 
	 * is convolution with one array flipped)
	 * @param  {object} array1 first number array
	 * @param  {object} array2 second number array
	 * @return {object}        correlation result array
	 */
	matLab.prototype.corr = function(array1,array2)
	{
		array1 = array1.reverse();
		return this.conv(array1,array2);
	}


	
	
	/**
	 * calculates hamming window values for specified length
	 * @param  {number} framelen length of window needed
	 * @return {object}          array with calculated window values
	 */
	matLab.prototype.hamming = function(framelen)
	{
		var win = [];
		for(var n=0;n<framelen;n++)
		{
			win[n] = 0.54-(0.46*Math.cos(2*Math.PI*n/(framelen-1)));
		}
		return win;
	}

	/**
	 * calculates discrete cosine transform of number array
	 * @param  {object} array number array
	 * @return {object}       array with dct values
	 */
	matLab.prototype.dct = function(array)
	{
		var N = array.length;
		var y=[],coeff={w1:1/Math.sqrt(N),w2:Math.sqrt(2/N)};
		for(var k=0;k<N;k++)
		{
			y[k]=0;
			w = k==0?coeff.w1:coeff.w2;
			for(var n=0;n<N;n++)
			{
				y[k]+=array[n]*Math.cos(Math.PI*(2*n+1)*k/(2*N));
			}
			y[k]*=w;
		}
		return y;
	}

	/**
	 * linearly places given number of elements between start and stop values (including start and stop)
	 * @param  {number} start  start value
	 * @param  {number} stop   stop value
	 * @param  {number} numtot total length
	 * @return {object}        array with linearly spaced elements
	 */
	matLab.prototype.linspace = function(start,stop,numtot)
	{
		var incr = (stop-start)/(numtot-1);
		var temp = [];
		for(var i=0;i<numtot-2;i++)
		{
			temp[i] = start+(i+1)*incr;
		}
		return [start].concat(temp,stop);

	}

    
    
    /**
     * plots line chart using chart.js with y values specified in y_array and x values in x_array
     * also, clears and destroys the previous chart upon drawing another
     * @param  {object} x_array x-axis values (default : 1 to length of y_array)
     * @param  {object} y_array y-axis values
     */
	matLab.prototype.plot = function(x_array,y_array)
	{
		var x = x_array||this.range(1,y_array.length);

		if(this.chart!=null)
		{
			this.chart.clear();
			this.chart.destroy();
			this.chart = null;
		}
		this.chart = setUpchart(x,y_array,this.context);

	}
	


	/**
	 * calculates inverse fourier transform of provided array values
	 * @param  {object} frame number or complex number array
	 * @param  {number} nfft  nfft point
	 * @return {object}       complex number array with ifft values
	 */
	matLab.prototype.ifft = function(frame,nfft)
	{
		if(typeof(frame[0])=="number")
		{
			frame = this.complexarray(frame);
		}
		var conjugate = this.conj(frame);
		var x = this.fft(conjugate,nfft);
		return this.scalarmult(x,1/nfft);
	}


	

	/**
	 * calculates fourier transform using radix-2 butterfly  
	 * @param  {object} frame number or complex number array
	 * @param  {number} nfft  nfft point fft
	 * @return {object}       complex number array with fft values
	 */
	matLab.prototype.fft = function(frame,nfft)
	{
		//pad zeros if not equal length
		var frlen=frame.length;
		if(frlen!=nfft)
		{
			frame = frame.concat(this.fill(nfft-frlen))
		}
		//frame is complex array or not,if not make it complex. 
		if(typeof(frame[0])=="number")
		{
			frame = this.complexarray(frame);
		}

		var stages = Math.log2(nfft); //num stages
		var z = this.bitRevIndices(frame); //bitreversed complex array
		var twiddles = this.twiddle(nfft,0,true); //twiddle factors complex  array
		var stwI=[],y=[]; //stage twiddle factor indices
		var p,ind;

		for(var m=1;m<=stages;m++)
		{
			p = Math.pow(2,m);
			stwI =  this.range(0,(p/2)-1).map(function(val) //2^(m-1)-1
				{
					return nfft*val/p; // N*t/2^m
				});
			ind = stwI;
			
			for(var q=stwI.length;q<nfft/2;q = stwI.length)
			{
				stwI = stwI.concat(ind);
			}
			
			for(var k=0,i=0;k<nfft;k++)
			{
				if(y[k]==null)
				{

					temp = computefly(z[k],z[k+(p/2)],twiddles[stwI[i]],this); //seperation in each stage is 0,2,4,8,16
					y[k] = temp[0];
					y[k+(p/2)] = temp[1];
					i++;
				}
			}
			z=y;
			y=[];
		}

		return z;

	}

	


	
	/**
	 * provides butterworth filtering of input array signal values
	 * @param  {object} signal array with signal values (number or complex)
	 * @param  {number} order  order of the filter
	 * @param  {number} cutoff cutoff frequency in Hertz 
	 * @param  {number} sfreq  sampling frequency of signal
	 * @param  {number} gain   DC gain (optional)
	 * @param  {number} n      n point fft (optional)
	 * @return {object}        filtered signal complex array
	 */
	matLab.prototype.butter = function(signal,order,cutoff,sfreq,gain,n)
	{
		var Gain = gain||1;

		var g;
		var cfft=[];
		var olen = signal.length;
		var N = n||Math.pow(2,(Math.ceil(Math.log2(signal.length)))+1); 
		
		var sfft = this.fft(signal,N); 
		var step = (sfreq/N)/cutoff;
		for(var i=0;i<N/2;i++)
		{
			g = Gain/Math.sqrt(1+Math.pow(i*step,2*order));
			
			if(i==0)
			{
				cfft[i] = this.scalarmult(sfft[i],g);
				cfft[N/2] = this.scalarmult(sfft[N/2],Gain/Math.sqrt(1+Math.pow((N/2)*step,2*order)));
				continue;
			}
			cfft[i] = this.scalarmult(sfft[i],g);
			cfft[(N)-i] = this.conj(cfft[i]);
		}
		
		
		var ifft = this.ifft(cfft,N);
		ifft = ifft.splice(0,olen);
		return [cfft,ifft];

	}
	
	

	/**
	 * finds the bit reversed order of array elements
	 * @param  {object} frame number or complex array to arrange in bitreversed order
	 * @return {object}       bit reversed complex or number array
	 */
	matLab.prototype.bitRevIndices = function(frame)
	{
		var s;
		var l = Math.ceil(Math.log2(frame.length));
		return this.range(0,frame.length-1,1).map(function(val)
			{	
				s = val.toString(2).split('');
				while(s.length < l)
				{
					s.unshift('0');
				}
				return frame[parseInt(s.reverse().join(''),2)];

			});
	}

	
	

	/**
	 * basic complex number addition
	 * @param  {object} c1 first complex number 
	 * @param  {object} c2 second complex number 
	 * @return {object}    added complex number
	 */
	matLab.prototype.complexadd = function(c1,c2)
	{
		
		return [c1[0]+c2[0],
				c1[1]+c2[1]
				];
	}

	
	/**
	 * calculates complex conjugate of complex number array
	 * @param  {object} complex complex number array
	 * @return {object}         conjugated complex number array
	 */
	matLab.prototype.conj = function(complex)
	{
		if(typeof(complex[0])=="object")
		{
		return complex.map(function(num)
			{
				return [num[0],-num[1]];
			});
		}
		else
		{
			return [complex[0],-complex[1]];
		}
	}

	/**
	 * basic complex number multiplication
	 * @param  {object} c1 first complex number 
	 * @param  {object} c2 second complex number 
	 * @return {object}    multiplied complex number
	 */
	matLab.prototype.complexmult = function(c1,c2)
	{

		return [
				 (c1[0]*c2[0])-(c1[1]*c2[1]),
				 (c1[0]*c2[1])+(c1[1]*c2[0])
				];
	}

	

	/**
	 * scalar multiplication of number or complex number array
	 * @param  {object} array number or complex number array
	 * @param  {number} k     scalar
	 * @return {object}       scalar multiplied number or complex number array
	 */
	matLab.prototype.scalarmult = function(array,k)
	{
		if(typeof(array[0])=="number")
		{
			return array.map(function(val)
				{
					return val*k;
				});
		}
		else
		{
			return array.map(function(val)
				{
					return [val[0]*k,val[1]*k];
				});
		}
	}


	/**
	 * converts number array into complex number array [[r,i],[r,i],[r,i]]
	 * @param  {object} r_array number array
	 * @param  {object} i_array imaginary part of number array (optional default : 0)
	 * @return {object}         created complex number array
	 */
	matLab.prototype.complexarray = function(r_array,i_array)
	{
		i_array=i_array||this.fill(r_array.length);
		return r_array.map(function(val,index)
			{
				return [val,i_array[index]]
			});
	}



	/**
	 * calculates twiddle factor for specified N and k (e^(-j2(pi)/N)*k) or uptill 0-N if full is true
	 * @param  {number} N    N in twiddle factor
	 * @param  {number} k    k in twiddle factor
	 * @param  {Boolean} full if true, returns all twiddle factors from 0-N (default : false)
	 * @return {object}      complex number or complex number array iwth twiddle factor value(s)
	 */
	matLab.prototype.twiddle = function(N,k,full)
	{
		if(full == true)
		{
			var tw =[],temp;
			for(var k=0;k<N;k++)
			{
				if(k<N/2)
				{
					tw[k] = ([Math.cos(this.PI*2*k/N),Math.sin(-(this.PI*2*k/N))]);
				}

				else
				{	//symmetry property of twiddle factors
					temp = k-(N/2);
					tw[k] = [-tw[temp][0],-tw[temp][1]];
				}
			}
			return tw;
		}

		else
			return [Math.cos(this.PI*2*k/N),Math.sin(-(this.PI*2*k/N))];
		
	}


	
	/**
	 * adds two number arrays
	 * @param  {object} array1 first number array
	 * @param  {object} array2 second number array
	 * @return {object} 	   number array with added values   
	 */
	matLab.prototype.add = function(array1,array2)
	{
		try{
			if(array1.length!=array2.length)
			{
				throw 'lengths must match';
			}	
			return array1.map(function(val,i)
			{
				return val+array2[i];
			});
		}catch(err)
		{
			log(err);
			return;
		}
		
	}

	/**
	 * subtracts two number arrays
	 * @param  {object} array1 first number array
	 * @param  {object} array2 second number array
	 * @return {object} 	   number array with subtracted values   
	 */
	matLab.prototype.sub = function(array1,array2)
	{
		try{
			if(array1.length!=array2.length)
			{
				throw 'lengths must match';
			}	
			return array1.map(function(val,i)
			{
				return val-array2[i];
			});
		}catch(err)
		{
			log(err);
			return;
		}
		
	}


	/**
	 * multiplies two number arrays
	 * @param  {object} array1 first number array
	 * @param  {object} array2 second number array
	 * @return {object} 	   number array with multiplied values   
	 */
	matLab.prototype.mult = function(array1,array2)
	{
		try{
			if(array1.length!=array2.length)
			{
				throw 'lengths must match';
			}	
			return array1.map(function(val,i)
			{
				return val*array2[i];
			});
		}catch(err)
		{
			log(err);
			return;
		}
		
	}

	/**
	 * creates sin wave of specified frequency, sample rate and length
	 * @param  {number} f      frequency of sine wave
	 * @param  {number} fs     sample rate
	 * @param  {object} tarray [start,stop] number array providing start and stop lengths  
	 * @return {object}        created sine wave
	 */
	matLab.prototype.sin = function(f,fs,tarray)
	{
		var t = this.range(tarray[0],tarray[1]);
		var v = this.scalarmult(t,2*this.PI*f/fs)
		return v.map(Math.sin);
	}


	//////////////////////
	//utility functions //
	//////////////////////

	/**
	 * computes butterfly pair [a+b*tw,a-b*tw]
	 * @param  {object} a   first complex number
	 * @param  {object} b   second complex number
	 * @param  {object} tw  twiddle factor
	 * @param  {object} cnt context for external function
	 * @return {object}     complex array with calculated butterfly pair
	 */
	function computefly(a,b,tw,cnt)
	{
	
		var d = cnt.scalarmult(b,-1);
		return [cnt.complexadd(a,cnt.complexmult(b,tw)),cnt.complexadd(a,(cnt.complexmult(d,tw)))];
	}

	/**
	 * logs into console window of browser (debugging)
	 * @param  {var} m message to log
	 */
	function log(m)
	{
		console.log(m);
	}

	/**
	 * set up and draws the line chart into canvas using chart.js
	 * @param  {object} x       x-axis number array
	 * @param  {object} y       y-axis number array
	 * @param  {object} context canvas context
	 * @return {object}         chart instance
	 */
	function setUpchart(x,y,context)
	{
		var data = 	{
		    			labels: x,
		    			datasets: 
		    			[
		        			{
			            		fillColor: "rgba(220,220,220,0.2)",
					            strokeColor: "rgba(250,120,120,1)",
					            pointColor: "rgba(60,60,60,0.6)",
					            pointStrokeColor: "#fff",
					            pointHighlightFill: "#fff",
					            pointHighlightStroke: "rgba(220,220,220,1)",
					            data:y
		        			}
		   				]
					};
		var options =
		{
			tooltipEvents:[],
			showTooltips: false,
			responsive:true,
			pointDot:false,
			
			
		};
		var chart = new Chart(context).Line(data,options);
		return chart;
	}


}());


