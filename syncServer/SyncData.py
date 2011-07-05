#!$HOME/bin/python
# -*- coding: utf-8 -*-

import time

class SyncData:
	def __init__ (self, data = None):
		if data == None:
			self.__defaults()
		else:
			self.__parse( data )
			
	def __defaults (self):
		self.searches = SyncDataEntry( [] )
		self.groups = SyncDataEntry( [] )
		self.seen = SyncDataEntry( [] )
		self.ranks = SyncDataEntry( {} )
	
	def __parse (self, data):
		types = {
				"searches": "list",
				"groups": "list",
				"seen": "list",
				"ranks" : "dict"
			}
		try:
			for k in ["searches", "groups", "seen", "ranks"]:
				value = self.__extractValue(k, data)
				
				if type( value.items ).__name__ == types[k]:
					self[k] = value
				else:
					raise BadInputException( "Bad data" )
					
		except KeyError:
			raise BadInputException( "Missing data" )
			
	def __extractValue (self, key, data):
		if type(data[key]).__name__ != "instance":
			return SyncDataEntry( data[key] )
		else:
			return data[key]
			
	def __getitem__ (self, key):
		helper = {
				"searches": lambda: self.searches,
				"groups": lambda: self.groups,
				"seen": lambda: self.seen,
				"ranks": lambda: self.ranks,
			}
		
		return helper[ key ]()
		
	def __setitem__ (self, key, value):
		if key not in ["searches", "groups", "seen", "ranks"]:
			raise KeyError()
			
		if key == "searches":
			self.searches = value
		if key == "groups":
			self.groups = value
		if key == "seen":
			self.seen = value
		if key == "ranks":
			self.ranks = value
		
class SyncDataEntry:
	def __init__ (self, items):
		self.timestamp = time.time()
		self.items = items
		
class BadInputException (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)