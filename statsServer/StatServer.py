#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

from StatCollector import StatCollector

import cgi
import sys
from wsgiref.handlers import CGIHandler


class StatServer:

	def __init__(self, environ, start_response):
		self.environ = environ
		self.start = start_response

	def __iter__(self):
		self.query = cgi.parse_qs( self.environ[ "QUERY_STRING" ] );
		
		try:
			self.__verifyRequest()
		except WrongUserAgentException:
			self.__headersAndStart( "400 Bad Request" )
			yield "Unsupported user agent"
		except WrongAPIKeyException:
			self.__headersAndStart( "400 Bad Request" )
			yield "Unrecognised api key"
		else:
			self.__headersAndStart( "200 OK" )
			output = self.processRequest()
			yield output
	
	def __verifyRequest (self):
		if self.environ[ "HTTP_USER_AGENT" ] != "Twitulater":
			raise WrongUserAgentException( "Wrong user agent" )
		try:
			if self.query[ "api_key" ][ 0 ] != "cJdV72hJGIKXWtyoovR5fIvsXM3E":
				raise WrongAPIKeyException( "Wrong API key" )
		except KeyError:
			raise WrongAPIKeyException( "Wrong API key" )
	
	def __headersAndStart ( self, status ):
		response_headers = [('Content-type','text/plain')]
		self.start(status, response_headers)
		
	def processRequest (self):
		if self.environ[ "REQUEST_METHOD" ] == "GET":
			return self.__getRequest()
		else:
			return self.__postRequest()
			
	def __getRequest ( self ):
		collector = StatCollector()
		try:
			try:
				id = int( self.query[ "id" ][0] )
			except ValueError:
				id = None
			id = collector.register({ "id" : id })
		except KeyError:
			id = collector.register({})
			
		collector.saveState()
		
		return str( id )
		
	def __postRequest ( self ):
		data = cgi.parse_qs( sys.stdin.read() )
		
		collector = StatCollector()
		user = {}
		for k in ["id", "uptime", "tweets", "followers", "following", "searches", "groups", "language", "accounts", "version"]:
			if k == "id":
				try:
					user[k] = int(data[k][0])
				except KeyError:
					user[k] = collector.register({});
			if k in ["tweets", "followers", "following", "searches", "groups"]:
				try:
					user[k] = int(data[k][0])
				except KeyError:
					user[k] = 0
			if k in ["uptime", "version"]:
				try:
					user[k] = float(data[k][0])
				except KeyError:
					user[k] = -0.1
			if k == "language":
				try:
					user[k] = data[k][0]
				except KeyError:
					user[k] = "unknown"
			if k == "accounts":
				try:
					user[k] = data[k][0].split(",")
				except KeyError:
					user[k] = []
		
		collector.storeData( user )
		collector.saveState()
		
		return "Stored"
		
class WrongUserAgentException (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)
		
class WrongAPIKeyException (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)

if __name__ == '__main__':
	CGIHandler().run(StatServer)