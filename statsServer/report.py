#!/usr/bin/python2.5
# -*- coding: utf-8 -*-

from StatCollector import StatCollector

def myapp(environ, start_response):
	start_response('200 OK', [('Content-Type', 'text/plain')])
	output = []
	
	collector = StatCollector();
	
	output.append( "App user count: %d\n" % collector.userCount() )
	output.append( "Avg. run count: %fs\n" % collector.avgRunCount() )
	output.append( "Avg. uptime: %fs\n" % collector.avgUptime() )
	output.append( "Avg. tweets: %f\n" % collector.avgTweets() )
	output.append( "Language use: %s\n" % collector.langUse() )
	output.append( "Accounts (%d): %s\n" % (len(collector.users()), ", ".join(collector.users()) ) )
    
	return output

if __name__ == '__main__':
	from wsgiref.handlers import CGIHandler
	CGIHandler().run(myapp)
