#!/usr/bin/python
# -*- coding: utf-8 -*-

import unittest
import time
import random

from StatCollector import StatCollector
from StatCollector import IncompleteDataException
from StatUser import StatUser

class StatCollectorTestCase( unittest.TestCase ):
	def setUp( self ):
		self.collector = StatCollector()
		
	def tearDown( self ):
		self.collector.saveState()
		self.collector = None
		
	def testReturnsNewId(self):
		userData = {}
		id = self.collector.register( userData )
		
		self.assert_( id != None )
		
	def testReturnsId(self):
		userData = { "id" : 1 }
		id = self.collector.register( userData );
		
		self.assertEquals( userData[ "id" ], id )
		
	def testReturnsIntegerId (self):
		for id in [1, "foo", "1foo", "<wer>\nlkjawer<\n\n"]:
			id = self.collector.register( { "id" : id } )
			
			self.assert_( type(id).__name__ == "int" )
		
	def testDistinctIds(self):
		ids = [ 0, 2, 3 ]
		userData = {}
		
		for id in ids:
			userData[ id ] = id
			self.collector.register( userData )
			
		userData[ "id" ] = None
		userData[ "id" ] = self.collector.register( userData )
		
		for id in ids:
			self.assertNotEqual( userData[ "id" ], id )
			
	def testNullify(self):
		self.collector.nullify( 1 )
		self.tearDown()
		self.setUp()
		user = self.collector.getUser( 1 )
		
		self.assert_( user.uptime == 0 )
		self.assert_( user.tweets == 0 )
		self.assert_( len( user.runTimes ) == 0 )
		self.assert_( len( user.properties["accounts"] ) == 0 )
		for k in [ "followers", "following", "searches", "groups", "language", "version" ]:
			self.assert_( user.properties[ k ] == 0 )
		
	def testStoreData(self):
		languages = [ "lj", "mb", "nm", "kp" ]
		ids = [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ]
		nicks = [ "test", "lol", "haha", "idiot" ]
		random.seed( time.time() )
		self.collector.nullify( 1 )
		self.collector.nullify( 2 )
		self.collector.nullify( 3 )
		
		users = { 1: StatUser( 1 ), 2: StatUser( 2 ), 3: StatUser( 3 ) }
		for id in users.keys():
			users[ id ].loopCount = 0
			users[ id ].uptime_t = 0
			users[ id ].tweets_t = 0
		
		# teh setup :D
		for id in ids:
			uptime = random.randint( 1, 100 )
			tweets = random.randint( 0, 10 )
			
			userData = {
				"id" : id,
				"uptime" : uptime,
				"tweets" : tweets,
				"followers" : random.randint( 0, 300 ),
				"following" : random.randint( 0, 300 ),
				"searches" : random.randint( 0, 10 ),
				"groups" : random.randint( 0, 10 ),
				"language" : random.choice( languages ),
				"accounts" : [ random.choice( nicks ), random.choice( nicks ) ],
				"version" : random.randint( 1, 5 )
			}
			
			# this should replicate real conditions a bit
			self.tearDown()
			time.sleep( 1 )
			self.setUp()
			self.collector.register( userData )
			self.collector.storeData( userData )
			
			# save so we can test the storing
			users[ id ].loopCount += 1
			users[ id ].uptime_t += uptime
			users[ id ].tweets_t += tweets
			users[ id ].properties[ "followers" ] = userData[ "followers" ]
			users[ id ].properties[ "following" ] = userData[ "following" ]
			users[ id ].properties[ "searches" ] = userData[ "searches" ]
			users[ id ].properties[ "groups" ] = userData[ "groups" ]
			users[ id ].properties[ "language" ] = userData[ "language" ]
			users[ id ].properties[ "accounts" ] = userData[ "accounts" ]
			users[ id ].properties[ "version" ] = userData[ "version" ]
		
		self.tearDown()
		time.sleep( 1 )
		self.setUp()
			
		# teh real test
		for id in [ 1, 2, 3 ]:
			user = self.collector.getUser( id )
			
			self.assertEquals( users[ id ].uptime_t/users[ id ].loopCount, user.avgUptime() )
			self.assertEquals( users[ id ].tweets_t/users[ id ].loopCount, user.avgTweets() )
			for k in [ "followers", "following", "searches", "groups", "language", "accounts", "version" ]:
				self.assertEquals( users[ id ].properties[ k ], user.properties[ k ] )
			
	def testRunTimes(self):
		ids = [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ]
		self.collector.nullify( 1 )
		self.collector.nullify( 2 )
		self.collector.nullify( 3 )
		times = { 1: [], 2: [], 3: [] }
		
		for id in ids:
			userData = {"id" : id}
			times[ id ].append( time.time() )
			self.collector.register( userData )
			
			time.sleep( 2 )
			
		for id in [1,2,3]:
			user = self.collector.getUser( id )
			self.assert_( len( user.runTimes ) == 3 )
			
			for i, t in enumerate( times[ id ] ):
				self.assertAlmostEqual( t, user.runTimes[ i ], 0 )
		
	def testIncompleteData(self):
		random.seed( time.time() )
		keys = ["uptime", "tweets", "followers", "following", "searches", "groups", "languages", "accounts", "version"]
		self.collector.register( {"id" : 1 } )
		
		for i in range(10):
			userData = {
				"id" : 1,
				random.choice( keys ): random.randint( 0, 300 ),
				random.choice( keys ): random.randint( 0, 300 ),
			}
			self.assertRaises( IncompleteDataException, self.collector.storeData, userData )
			
		
	
if __name__ == '__main__':
    unittest.main()