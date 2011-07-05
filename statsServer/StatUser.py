#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

import time

class StatUser:
	def __init__ (self, id=None):
		self.id = id
		self.uptime = 0
		self.tweets = 0
		self.runTimes = []
		self.properties = {
			"followers" : 0,
			"following" : 0,
			"searches" : 0,
			"groups" : 0,
			"language" : 0,
			"accounts" : [],
			"version" : 0
		}

	def addRunTime (self):
		self.runTimes.append( time.time() )

	def addUptime (self, uptime ):
		self.uptime += uptime
		
	def addTweets (self, tweets ):
		self.tweets += tweets
		
	def addValue (self, key, value):
		if key == "uptime":
			self.addUptime( value )
		else:
			if key == "tweets":
				self.addTweets( value )
			else:
				self.properties[ key ] = value
		
	def avgUptime (self):
		return self.uptime/len( self.runTimes )
		
	def avgTweets (self):
		#return self.tweets/len( self.runTimes )
		return self.tweets/len( self.runTimes )
		
	def runCount (self):
		return len( self.runTimes )