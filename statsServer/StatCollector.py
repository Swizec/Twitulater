#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

from StatUser import StatUser

import time
import pickle
import os
import fcntl

class StatCollector:
	def __init__ ( self ):
		self.__users = {}
		self.__readStats()
	
	def __readStats ( self ):
		try:
			stats = open( "stats.pkl", "rb" )
			self.__users = pickle.load( stats )
			stats.close()
		except IOError, errval:
			errno, strerror = errval
			if errno != 2:
				raise ServerError( "Serious server issue: "+strerror )
		
	def saveState ( self ):
		try:
			fd = os.fdopen(os.open('stats.pkl', os.O_CREAT | os.O_RDWR), "wb+")
			fcntl.flock(fd, fcntl.LOCK_EX)
			
			fd.write( pickle.dumps( self.__users ) )
			
			fcntl.flock(fd, fcntl.LOCK_UN)
			fd.close()
		except IOError:
			raise ServerError( "Serious server issue" )
		
	def register ( self, user ):
		id = self.__sanitiseId( user );
		user = StatUser( id )
		
		self.__addIfUnknown( user )
		self.__users[ user.id ].addRunTime()
			
		return user.id
		
	def __sanitiseId (self, user):
		try:
			if user[ "id" ] == None:
				id = self.__newId()
			else:
				try:
					id = int(user[ "id" ])
				except ValueError:
					id = self.__newId()
		except KeyError:
			id = self.__newId()
			
		return id
		
	def __newId ( self ):
		ids = self.__users.keys()
		try:
			id = ids[-1]+1
		except IndexError:
			id = 1
			
		return id
	
	def __addIfUnknown ( self, user ):
		if user.id not in self.__users:
			self.__addUser( user )
	
	def __addUser ( self, user ):
		self.__users[ user.id ] = user
		
	def nullify ( self, id ):
		self.__users[ id ] = StatUser( id )
		
	def storeData ( self, data ):
		user = self.getUser( data[ "id" ] )
		
		for k in ["uptime", "tweets", "followers", "following", "searches", "groups", "language", "accounts", "version"]:
			try:
				user.addValue( k, data[ k ] )
			except KeyError:
				raise IncompleteDataException( "Incomplete data, missing "+k )
		
		
	def getUser ( self, id ):
		return self.__users[ id ]
		
	def userCount ( self ):
		return len( self.__users )
		
	def avgRunCount (self):
		c = 0
		for id in self.__users:
			c += self.__users[ id ].runCount()
		return c/len(self.__users)
		
	def avgUptime (self):
		up = 0.0
		for id in self.__users:
			up += self.__users[ id ].avgUptime()
		return up/len(self.__users)
		
	def avgTweets (self):
		tweets = 0.0
		for id in self.__users:
			tweets += self.__users[ id ].avgTweets()
		#return tweets/len(self.__users)
		return tweets
		
	def langUse (self):
		languages = {}
		
		for id in self.__users:
			lang = self.__users[ id ].properties[ "language" ]
			try:
				languages[ lang ] += 1
			except KeyError:
				languages[ lang ] = 1
		
		output = ""
		for lang in languages:
			output += "%s: %d, " % (lang, languages[ lang ])
			
		return output
		
	def users (self):
		nicks = []
		
		for id in self.__users:
			nicks.extend( self.__users[ id ].properties[ "accounts" ] )
		
		nicks.sort();
		
		return nicks
		
class ServerError (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)
		
class IncompleteDataException (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)