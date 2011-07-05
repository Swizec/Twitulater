#!$HOME/bin/python
# -*- coding: utf-8 -*-

import SyncUser
import SyncData

import pickle
import copy

class SyncDataManager:
	def __init__ (self):
		self.__users = {}
		self.__readData()
	
	def __readData ( self ):
		try:
			data = open( "data.pkl", "rb" )
			self.__users = pickle.load( data )
			data.close()
		except IOError, errval:
			errno, strerror = errval
			if errno != 2:
				raise ServerError( "Serious server issue" )
	
	def write (self, user):
		self.__users[ str(user) ] = copy.deepcopy( user );
	
	def read (self, id):
		if type(id).__name__ == "instance":
			id = str(id)
		
		try:
			return self.__users[id].data()
		except KeyError:
			raise UnknownUser( "User with id %s doesn't exist" % id )
	
	def store (self):
		try:
			data = open( "data.pkl", "wb" )
			pickle.dump( self.__users, data )
			data.close()
		except IOError:
			raise ServerError( "Serious server issue" )
			
	def __del__ (self):
		self.store()
		
	def sync (self, user):
		localData = self.__getLocalData( user )
		externalData = user.data()
		
		externalChanges, ultimateData = self.__compare( localData, externalData )
		
		self.__storeUltimateData( user, ultimateData )
		
		return externalChanges
		
	def __getLocalData (self, user):
		try:
			localData = self.read( str(user) )
		except UnknownUser:
			localData = SyncData.SyncData()
			for k in ["searches", "groups", "seen", "ranks"]:
				localData[k].timestamp = 0
			
		return localData
		
	def __compare (self, localData, externalData ):
		ultimateData = copy.deepcopy( localData )
		externalChanges = {}
		
		for k in ["searches", "groups", "seen", "ranks"]:
			if localData[k].items != externalData[k].items:
				if localData[k].timestamp > externalData[k].timestamp:
					externalChanges[k] = localData[k]
				else:
					ultimateData[k] = externalData[k]
		
		return ( externalChanges, ultimateData )
		
	def __storeUltimateData (self, user, data ):
		user.data( data )
		self.write( user );
		
class ServerError (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)
		
class UnknownUser (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)