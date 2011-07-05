#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

import unittest
import time
import copy
import random

from SyncDataManager import SyncDataManager
from SyncData import SyncData
from SyncData import SyncDataEntry
from SyncUser import SyncUser
from SyncDataManager import UnknownUser

class SyncDataManagerTestCase( unittest.TestCase ):
	def setUp (self):
		self.manager = SyncDataManager()
		self.keys = ["searches", "groups", "seen", "ranks"]
	
	def tearDown (self):
		self.manager = None
		
	def testAcceptsData (self):
		user = SyncUser( ["test", "Twitter"] )
		user.data({
				"searches" : ["bla", "lol"],
				"groups" : ["hah", "heh"],
				"seen" : [1,2,3],
				"ranks" : {"lol1": 0.3, "lol2" : 0.1 }
				})
		
		self.manager.write( user )
		
		fixture = self.manager.read( str(user) )
		
		for k in self.keys:
			self.assertEquals( fixture[k].items, user.data()[k].items )
		
	def testPermanentlyStoresData (self):
		data = {
				"searches" : ["bla", "lol"],
				"groups" : ["hah", "heh"],
				"seen" : [1,2,3],
				"ranks" : {"lol1": 0.3, "lol2" : 0.1 }
				}
		user = SyncUser( ["test", "Twitter"] )
		user.data(data)
		
		self.manager.write( user )
		self.manager.store()
		
		self.tearDown()
		self.setUp()
		
		fixture = self.manager.read( str(user) )
		
		for k in self.keys:
			self.assertEquals( fixture[k].items, data[k] )
			
	def testStoresOnDeath (self):
		data = {
				"searches" : ["bla", "lol"],
				"groups" : ["hah", "heh"],
				"seen" : [1,2,3],
				"ranks" : {"lol1": 0.3, "lol2" : 0.1 }
				}
		user = SyncUser( ["testicles", "Twitter"] )
		user.data(data)
		
		self.manager.write( user )
		
		self.tearDown()
		self.setUp()
		
		fixture = self.manager.read( str(user) )
		
		for k in self.keys:
			self.assertEquals( fixture[k].items, data[k] )
			
	def testGracefulFailOnUnknownUser (self):
		self.assertRaises( UnknownUser, self.manager.read, "haha_omfglol" )
		
	def testSyncEqualData (self):
		data1 = {
				"searches" : SyncDataEntry( ["bla", "lol"] ),
				"groups" : SyncDataEntry( ["hah", "heh"] ),
				"seen" : SyncDataEntry( [1,2,3] ),
				"ranks" : SyncDataEntry( {"lol1": 0.3, "lol2" : 0.1 } )
				}
		equalData = copy.deepcopy( data1 )
		user = SyncUser( ["syncer", "Twitter"] )
		user.data( data1 )
		
		self.manager.write( user )
		
		user.data( equalData )
		
		changedData = self.manager.sync( user )
		
		self.assert_( len( changedData ) == 0 )
		
	def testCanReadWithSyncUserAsArgument (self):
		data = {
				"searches" : SyncDataEntry( ["bla"] ),
				"groups" : SyncDataEntry( ["hah", "heh", "hoho"] ),
				"seen" : SyncDataEntry( [1,2,3,5,6] ),
				"ranks" : SyncDataEntry( {"lol1": 0.6, "lol2" : 0.1 } )
				}
		user = SyncUser( ["bla", "Twitter"] )
		user.data( data )
		
		self.manager.write( user )
		
		fixture = self.manager.read( user )
		
		for k in self.keys:
			self.assertEquals( fixture[k].items, user.data()[k].items )
		
	def testSyncChangesAreNewerAndStateIsStored (self):
		origTime = time.time()
		serverData = {
				"searches" : SyncDataEntry( ["bla", "lol"] ),
				"groups" : SyncDataEntry( ["hah", "heh"] ),
				"seen" : SyncDataEntry( [1,2,3] ),
				"ranks" : SyncDataEntry( {"lol1": 0.3, "lol2" : 0.1 } )
				}
		userData = {
				"searches" : SyncDataEntry( ["bla"] ),
				"groups" : SyncDataEntry( ["hah", "heh", "hoho"] ),
				"seen" : SyncDataEntry( [1,2,3,5,6] ),
				"ranks" : SyncDataEntry( {"lol1": 0.6, "lol2" : 0.1 } )
				}
		origUser = SyncUser( ["syncer", "Twitter"] )
		origUser.data( serverData )
		random.seed( time.time() )
		
		
		# permute a random amount of changed entries over random timestamp differences
		for i in range(100):
			data = {}
			user = SyncUser( ["syncer", "Twitter"] )
			expectedChange = {}
			usedKeys = []
			
			for j in range(random.randint(0,4)):
				t = origTime+random.choice( [-1,1] )
				k = random.choice( self.keys )
				if k in usedKeys:
					continue
				usedKeys.append( k )
				
				data[k] = userData[k]
				data[k].timestamp = t
				
				if t < origTime:
					expectedChange[k] = serverData[k]
			
			for k in self.keys:
				if k not in usedKeys:
					data[k] = serverData[k]
			
			self.manager.write( origUser )
			user.data( data )
			changes = self.manager.sync( user )
			
			self.assertEquals( len(expectedChange), len(changes) )
			
			for k in expectedChange.keys():
				self.assertEquals( expectedChange[k].items, changes[k].items )
				data[k] = changes[k]
			
			fixture = self.manager.read( user )
			
			for k in self.keys:
				self.assertEquals( fixture[k].items, data[k].items )
				
	def testSyncsUnknownUser (self):
		data = {
				"searches" : SyncDataEntry( ["bla"] ),
				"groups" : SyncDataEntry( ["hah", "heh", "hoho"] ),
				"seen" : SyncDataEntry( [1,2,3,5,6] ),
				"ranks" : SyncDataEntry( {"lol1": 0.6, "lol2" : 0.1 } )
				}
		user = SyncUser( ["dontexist", "nope"] )
		user.data( data )
		
		self.manager.sync( user )
		fixture = self.manager.read( user )
		
		for k in self.keys:
			self.assertEquals( fixture[k].items, data[k].items )
	
if __name__ == '__main__':
    unittest.main()