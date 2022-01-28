#pragma once

#include "ofMain.h"
#include "ofxKinect.h"
#include <Poco/Net/WebSocket.h>
#include <Poco/Net/HTTPRequest.h>
#include <Poco/Net/HTTPResponse.h>
#include <Poco/Net/HTTPMessage.h>
#include <Poco/Net/WebSocket.h>
#include <Poco/Net/HTTPClientSession.h>
#include <vector>

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();

        void exit();
    
		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void mouseEntered(int x, int y);
		void mouseExited(int x, int y);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);
    
    void drawPointCloud();
    void sendCloud();
    
    bool debugMode, emit;
    int angle;
    int farClip, nearClip;
    
    ofMesh pointCloud;
    ofxKinect kinect;
    ofEasyCam cam;
    
    Poco::Net::WebSocket* m_psock;
};
