#!$HOME/bin/python
# -*- coding: utf-8 -*-

import cgi
import sys
from wsgiref.handlers import CGIHandler
import json

import SyncDataManager
import SyncUser
import SyncData

class SyncServer:

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
		except BadMethodException:
			self.__headersAndStart( "400 Bad Request" )
			yield "Only POST requests accepted"
		else:
			try:
				output = self.processRequest()
				self.__headersAndStart( "200 OK" )
				yield output
			except SyncData.BadInputException, error:
				self.__headersAndStart( "400 Bad Request" )
				yield error
			except KeyError:
				self.__headersAndStart( "400 Bad Request" )
				yield "Malformed data"
			
			
	def __verifyRequest (self):
		if self.environ[ "HTTP_USER_AGENT" ] != "Twitulater":
			raise WrongUserAgentException( "Wrong user agent" )
		if self.environ[ "REQUEST_METHOD" ] != "POST":
			raise BadMethodException( "Blabla" )
		try:
			if self.query[ "api_key" ][ 0 ] != "cJdV72hJGIKXWtyoovR5fIvsXM3E":
				raise WrongAPIKeyException( "Wrong API key" )
		except KeyError:
			raise WrongAPIKeyException( "Wrong API key" )
		
	def __headersAndStart ( self, status ):
		response_headers = [('Content-type','text/plain')]
		self.start(status, response_headers)
		
	def processRequest (self):
		data = cgi.parse_qs( sys.stdin.read() )
		
		nick = data["nickname"][0]
		protocol = data["protocol"][0]
		
		user = SyncUser.SyncUser( [nick, protocol] )
		user.data( self.__parseData(data) )
		
		output = self.__sync( user )
		
		return output
	
	def __parseData (self, data):
		temp = json.load( data["data"][0] )
		newData = {}
		
		for k in ["searches", "groups", "seen", "ranks"]:
			newData[k] = SyncDataEntry( temp[k]["items"] )
			newData[k].timestamp = temp[k]["timestamp"]
		
		return newData
		
	def __sync (self, user):
		manager = SyncDataManager.SyncDataManager()
		changes = manager.sync( user )
		
		manager.store()
		
		return self.__changesToJSON( changes )
		
	def __changesToJSOn (self, changes):
		temp = {}
		
		for k in changes.keys():
			temp[k] = changes[k].items
			
		return json.dumps( temp )

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
		
class BadMethodException (Exception):
	def __init__ (self, value):
		self.value = value
	
	def __str__ (self):
		return repr(self.value)


if __name__ == '__main__':
	CGIHandler().run(SyncServer)