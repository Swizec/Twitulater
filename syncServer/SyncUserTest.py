#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

import unittest
import time

from SyncUser import SyncUser
from SyncUser import InvalidUserIdException
from SyncData import SyncData

class SyncUserTestCase( unittest.TestCase ):
	def setUp (self):
		self.user = SyncUser( ["test", "Twitter"] ) 
		
	def tearDown (self):
		self.user = None
	
	def testSanitizesId (self):
		ids = [ ["blabla", "Twitter"], {"nick": "blabla", "protocol": "Twitter"}, "test_Twitter" ]
		
		user = SyncUser( ids[ 0 ] )
		self.assertEquals( user.id["nick"], ids[0][0] )
		self.assertEquals( user.id["protocol"], ids[0][1] )
		
		user = SyncUser( ids[ 1 ] )
		self.assertEquals( user.id["nick"], ids[1]["nick"] )
		self.assertEquals( user.id["protocol"], ids[1]["protocol"] )
		
		user = SyncUser( ids[ 2 ] )
		self.assertEquals( user.id["nick"], "test" )
		self.assertEquals( user.id["protocol"], "Twitter" )
			
	def testRefusesWrongId (self):
		ids = [ 1, "lol", ["ha"], {"nick": "blabla"}, {"protocol": "Twitter"}, {"hehe": "haha", "hoho": "hihi"}]
		
		for id in ids:
			self.assertRaises( InvalidUserIdException, SyncUser, id )
			
	def testUserToHash (self):
		hash = ""+str(self.user)
		
		self.assertEquals( hash, "test_Twitter" )
		
	def testAcceptsAndReturnsData (self):
		data = {
				"searches" : ["bla", "lol", "hah"],
				"groups" : ["meh", "moh"],
				"seen" : [1,2,3,4],
				"ranks" : {"lol1": 0.3, "lol2" : 0.1 }
			}
		
		fixture = self.user.data(data)
		
		for k in ["searches", "groups", "seen", "ranks"]:
			self.assertEquals( data[k], fixture[k].items )
		
	def testCanTakeSyncDataAsInput (self):
		data = SyncData({
				"searches" : ["bla", "lol", "hah"],
				"groups" : ["meh", "moh"],
				"seen" : [1,2,3,4],
				"ranks" : {"lol1": 0.3, "lol2" : 0.1 }
			})
		self.user.data( data )

if __name__ == '__main__':
    unittest.main()