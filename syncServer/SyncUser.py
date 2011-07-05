#!$HOME/bin/python
# -*- coding: utf-8 -*-

from SyncData import SyncData

class SyncUser:
	def __init__ (self, id):
		self.id = {}
		self.__data = SyncData()
		
		try:
			if type(id).__name__ == "str":
				self.__idFromString( id )
			else:
				self.__parseId( id )
		except InvalidUserIdException, error:
			raise InvalidUserIdException( error )
			
	def __idFromString (self, id):
		try:
			id = id.split("_")
			self.id["nick"] = id[0]
			self.id["protocol"] = id[1]
		except IndexError:
			raise InvalidUserIdException( "Id neither dict nor list" )
		
	def __parseId (self, id ):
		try:
			self.id["nick"] = id["nick"]
			self.id["protocol"] = id["protocol"]
		except TypeError:
			if type(id).__name__ == "list":
				try:
					self.id["nick"] = id[0]
					self.id["protocol"] = id[1]
				except:
					raise InvalidUserIdException( "Id neither dict nor list" )
			else:
				raise InvalidUserIdException( "Id neither dict nor list" )
		except KeyError:
			raise InvalidUserIdException( "Protocol and nick not provided" )
		
	def data (self, input=None):
		if input != None:
			self.__data = SyncData( input )
				
		return self.__data
	
	def __str__ (self):
		return self.id["nick"]+"_"+self.id["protocol"]
			
class InvalidUserIdException (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)