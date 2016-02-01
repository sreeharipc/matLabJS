


(function()
{

	//sign,diff,abs,mean,sum,square,std,zeros,maxpos,minpos,range,conv,corr,hamming,dct,plot,linspace


	//constructor
	this.matLab = function(opts)
	{
		this.context = opts.context||null;
		this.chart =null;
		this.PI = Math.PI;
		console.log('functions available');
		console.log('sign,diff,abs,mean,sum,square,std,zeros,maxpos,minpos,range,conv,corr,hamming,dct,plot,linspace');
	}


	//public functions
	matLab.prototype.sign = function(array)
	{
		return array.map(Math.sign);//x -> Math.sign(x)
	}

	matLab.prototype.diff = function(array)
	{
		var temp=[];
		for(var i=0;i<array.length-1;i++)
		{
			temp[i]=array[i+1]-array[i];
		}
		return temp;
	}

	matLab.prototype.abs = function(array)
	{
		return array.map(Math.abs);//x -> Math.abs(x)
	}

	matLab.prototype.mean = function(array)
	{
		return (this.sum(array)/array.length);
	}



	
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

	matLab.prototype.square = function(array)
	{
		return array.map(function(x){return x*x;});
	}

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

	matLab.prototype.zeros = function(num)
	{
		var array = [];
		for(var i=0;i<num;i++)
		{
			array[i]=0;
		}
		return array;
	}

	matLab.prototype.maxpos = function(array)
	{
		var temp = Math.max.apply(null,array);
		return [temp,array.indexOf(temp)];
	}

	matLab.prototype.minpos = function(array)
	{
		var temp = Math.min.apply(null,array);
		return [temp,array.indexOf(temp)];
	}


   //if step>0 start<stop && if step<0 start>stop =>should be
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
	//dsp functions
	
	matLab.prototype.conv = function(array1,array2)
	{
		var l = array1.length+array2.length-1,y=[];
		array1 = array1.concat(this.zeros(l-array1.length));
		array2 = array2.concat(this.zeros(l-array2.length));
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

	matLab.prototype.corr = function(array1,array2)
	{
		array1 = array1.reverse();
		return this.conv(array1,array2);
	}


	//window function
	matLab.prototype.hamming = function(framelen)
	{
		var win = [];
		for(var n=0;n<framelen;n++)
		{
			win[n] = 0.54-(0.46*Math.cos(2*Math.PI*n/(framelen-1)));
		}
		return win;
	}

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

    //requires chart.js
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
	

	//fft implimentation
	matLab.prototype.fft = function(frame,nfft)
	{
		//pad zeros if not equal length
		var frlen=frame.length;
		if(frlen!=nfft)
		{
			frame = frame.concat(this.zeros(nfft-frlen))
		}
		//frame is complex array or not,if not make it complex. 
		if(typeof(frame[0])=="number")
		{
			frame = this.complexarray(frame);
		}

		var stages = Math.log2(nfft); //num stages
		var z = this.bitRevIndices(nfft,stages,frame); //bitreversed complex array
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

	


	//butterworth filter 
	matLab.prototype.butter = function()
	{

	}
	
	matLab.prototype.filter = function()
	{

	}

	//return bitreversed complex array
	matLab.prototype.bitRevIndices = function(num,stages,frame)
	{
		var s;
		return this.range(0,num-1,1).map(function(val)
			{	
				s = val.toString(2).split('');
				while(s.length < stages)
				{
					s.unshift('0');
				}
				return frame[parseInt(s.reverse().join(''),2)];

			});
	}

	//absolute value of complex number array [[],[]]
	matLab.prototype.complexabs = function(carray)
	{
		return carray.map(function(val)
			{
				return Math.hypot(val[0],val[1]);
			});
	}

	

	//basic complex number addition []+[]
	matLab.prototype.complexadd = function(c1,c2)
	{
		
		return [c1[0]+c2[0],
				c1[1]+c2[1]
				];
	}

	//basic complex number multipilication []*[]
	matLab.prototype.complexmult = function(c1,c2)
	{

		return [
				 (c1[0]*c2[0])-(c1[1]*c2[1]),
				 (c1[0]*c2[1])+(c1[1]*c2[0])
				];
	}

	//array scalar multiplication []*k
	matLab.prototype.scalarmult = function(array,k)
	{
		return array.map(function(val)
			{
				return val*k;
			});
	}
	//returns array of complex numbers[[r,i],[r,i],[r,i]]
	matLab.prototype.complexarray = function(r_array,i_array)
	{
		i_array=i_array||this.zeros(r_array.length);
		return r_array.map(function(val,index)
			{
				return [val,i_array[index]]
			});
	}



	//returns all twiddle factors upto n if tot = true (for fft)
	//else returns the specified twiddle factor
	matLab.prototype.twiddle = function(n,k,tot)
	{
		if(tot == true)
		{
			var tw =[],temp;
			for(var k=0;k<n;k++)
			{
				if(k<n/2)
				{
					tw[k] = ([Math.cos(this.PI*2*k/n),Math.sin(-(this.PI*2*k/n))]);
				}

				else
				{	//symmetry property of twiddle factors
					temp = k-(n/2);
					tw[k] = [-tw[temp][0],-tw[temp][1]];
				}
			}
			return tw;
		}

		else
			return [Math.cos(this.PI*2*k/n),Math.sin(-(this.PI*2*k/n))];
		
	}

	/**private functions 
	used as utility for other public functions**/


	function computefly(a,b,tw,cnt)
	{
	
		var d = cnt.scalarmult(b,-1);
		return [cnt.complexadd(a,cnt.complexmult(b,tw)),cnt.complexadd(a,(cnt.complexmult(d,tw)))];
	}

	function log(m)
	{
		console.log(m);
	}

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


