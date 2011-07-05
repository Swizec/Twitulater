#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

import unittest
import time
import copy

from SyncData import SyncData
from SyncData import SyncDataEntry
from SyncData import BadInputException

class SyncUserTestCase( unittest.TestCase ):
	def setUp (self):
		self.keys = ["searches", "groups", "seen", "ranks"]
		
	def tearDown (self):
		pass
		
	def testGetItem (self):
		fixture = SyncData()
		
		for k in self.keys:
			self.assertEquals( len( fixture[ k ].items ), 0 )
		
		try:
			foo = fixture["bar"]
			self.fail( "Should've gotten a KeyError" )
		except KeyError:
			pass
	
	def testAcceptsData (self):
		data = {
				"searches" : ["bla", "lol", "hah"],
				"groups" : ["meh", "moh"],
				"seen" : [1,2,3,4],
				"ranks" : {"lol1": 0.3, "lol2" : 0.1 }
			 }
		
		fixture = SyncData( data )
		
		for k in self.keys:
			self.assertEquals( data[k], fixture[k].items )
			
	def testAcceptsTimestampedData (self):
		data = {
				"searches" : SyncDataEntry( ["bla", "lol", "hah"] ),
				"groups" : SyncDataEntry( ["meh", "moh"] ),
				"seen" : SyncDataEntry( [1,2,3,4] ),
				"ranks" : SyncDataEntry( {"lol1": 0.3, "lol2" : 0.1 } )
			}
		t = time.time()
		
		time.sleep(2)
		
		fixture = SyncData( data )
		
		for k in self.keys:
			self.assertAlmostEqual( fixture[k].timestamp, t, 2 )
	
	def testDeniesBadData (self):
		data = []
		right = {
				"searches" : ["bla", "lol", "hah"],
				"groups" : ["meh", "moh"],
				"seen" : [1,2,3,4],
				"ranks" : {"lol1": 0.3, "lol2" : 0.1 }
			}
		wrong = {
				"searches" : "",
				"groups" : {"meh": "moh"},
				"seen" : None,
				"ranks" : 5
			}
		
		for k in self.keys:
			temp = {}
			for l in self.keys:
				if l != k:
					temp[l] = right[l]
			
			# missing entry
			data.append( copy.deepcopy( temp ) )
			# wrong entry
			temp[k] = wrong[k]
			data.append( copy.deepcopy( temp ) )
		print len( data )
		
		for crap in data:
			self.assertRaises( BadInputException, SyncData, crap )
			
	def testDefaultValues (self):
		fixture = SyncData()
		t = time.time()
		
		for k in self.keys:
			self.assertAlmostEqual( fixture[k].timestamp, t, 2 );
			
		self.assertEquals( fixture.searches.items, [] )
		self.assertEquals( fixture.groups.items, [] )
		self.assertEquals( fixture.seen.items, [] )
		self.assertEquals( fixture.ranks.items, {} )

if __name__ == '__main__':
    unittest.main()