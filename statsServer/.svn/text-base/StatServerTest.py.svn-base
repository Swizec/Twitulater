#!/usr/bin/python
# -*- coding: utf-8 -*-

import unittest
from wsgiref.handlers import CGIHandler
import sys
from cStringIO import StringIO
import os
import time

import StatServer
import StatCollector

class StatServerTestCase( unittest.TestCase ):
	def setUp (self):
		os.environ = {
				"REQUEST_METHOD" : "GET",
				"SCRIPT_NAME" : "/",
				"PATH_INFO" : "",
				"QUERY_STRING" : "api_key=cJdV72hJGIKXWtyoovR5fIvsXM3E",
				"CONTENT_TYPE" : "",
				"CONTENT_LENGTH" : "",
				"SERVER_NAME" : "localhost",
				"SERVER_ROOT" : "/var",
				"SERVER_PROTOCOL" : "HTTP/1.1",
				"HTTP_USER_AGENT" : "Twitulater",
			}
		self.old_stdout = sys.stdout
		sys.stdout = StringIO()
		
	def tearDown( self ):
		sys.stdout = self.old_stdout
		
	def testDenyUserAgent (self):
		os.environ[ "HTTP_USER_AGENT" ] = "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.12) Gecko/2009070811 Ubuntu/9.04 (jaunty) Firefox/3.0.12"
		
		CGIHandler().run(StatServer.StatServer)
		out = sys.stdout.getvalue()
		
		self.assertEquals( out, "Status: 400 Bad Request\r\nContent-type: text/plain\r\n\r\nUnsupported user agent" )
		
	def testDenyAPIKey (self):
		os.environ[ "QUERY_STRING" ] = "id=1&api_key=foobar"
		
		CGIHandler().run(StatServer.StatServer)
		out = sys.stdout.getvalue()
		
		self.assertEquals( out, "Status: 400 Bad Request\r\nContent-type: text/plain\r\n\r\nUnrecognised api key" )
		
	def testReturnId (self):
		os.environ[ "QUERY_STRING" ] += "&id=1"
		CGIHandler().run(StatServer.StatServer)
		out = sys.stdout.getvalue()
		
		self.assertEquals( out, "Status: 200 OK\r\nContent-type: text/plain\r\n\r\n1" )
		
	def testEmptyId (self):
		CGIHandler().run(StatServer.StatServer)
		out = sys.stdout.getvalue()
		
		self.assertEquals( out[:-1], "Status: 200 OK\r\nContent-type: text/plain\r\n\r\n" )
		
	def testRegistersUser (self):
		os.environ[ "QUERY_STRING" ] += "&id=1"
		now = time.time()
		CGIHandler().run(StatServer.StatServer)
		
		collector = StatCollector.StatCollector()
		user = collector.getUser( 1 )
		
		self.assertAlmostEqual( now, user.runTimes[ -1 ], 2 )
		
	def testRejectsBadData (self):
		os.environ[ "QUERY_STRING" ] += "&id=1"
		
if __name__ == '__main__':
    unittest.main()