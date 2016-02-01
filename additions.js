//tried error handling :)
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

	matLab.prototype.sin = function(array)
	{
		return array.map(Math.sin);
	}
