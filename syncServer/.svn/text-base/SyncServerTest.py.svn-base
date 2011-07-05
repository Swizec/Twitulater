#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

import unittest
import os, sys
from cStringIO import StringIO
from wsgiref.handlers import CGIHandler

import SyncServer

class SyncServerTestCase( unittest.TestCase ):
	def setUp (self):
		os.environ = {
				"REQUEST_METHOD" : "POST",
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
		
	def tearDown (self):
		sys.stdout = self.old_stdout
		
	def testDenyUserAgent (self):
		os.environ[ "HTTP_USER_AGENT" ] = "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.12) Gecko/2009070811 Ubuntu/9.04 (jaunty) Firefox/3.0.12"
		
		CGIHandler().run(SyncServer.SyncServer)
		out = sys.stdout.getvalue()
		
		self.assertEquals( out, "Status: 400 Bad Request\r\nContent-type: text/plain\r\n\r\nUnsupported user agent" )
		
	def testDenyAPIKey (self):
		os.environ[ "QUERY_STRING" ] = "api_key=foobar"
		
		CGIHandler().run(SyncServer.SyncServer)
		out = sys.stdout.getvalue()
		
		self.assertEquals( out, "Status: 400 Bad Request\r\nContent-type: text/plain\r\n\r\nUnrecognised api key" )
		
	def testDenyBadMethod (self):
		os.environ[ "REQUEST_METHOD" ] = "GET"
		
		CGIHandler().run(SyncServer.SyncServer)
		out = sys.stdout.getvalue()
		
		self.assertEquals( out, "Status: 400 Bad Request\r\nContent-type: text/plain\r\n\r\nOnly POST requests accepted" )
		
if __name__ == '__main__':
    unittest.main()
    