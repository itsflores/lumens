#include "ofApp.h"

using Poco::Net::HTTPClientSession;
using Poco::Net::HTTPRequest;
using Poco::Net::HTTPResponse;
using Poco::Net::HTTPMessage;
using Poco::Net::WebSocket;

//--------------------------------------------------------------
void ofApp::setup(){
    kinect.setRegistration(true);
    kinect.init();
    kinect.open();
    debugMode = false;
    // milimeters
    nearClip = 500;
    farClip = 2000;
    
    // sockets ws
    // client.connect("localhost", 8081);
    HTTPClientSession cs("localhost",8081);
    HTTPRequest request(HTTPRequest::HTTP_GET, "/?encoding=text",HTTPMessage::HTTP_1_1);
    request.set("origin", "/");
    HTTPResponse response;
    
    WebSocket* m_psock = new WebSocket(cs, request, response);
    char const *testStr="{'test':'test'}";
    char receiveBuff[256];

    int len=m_psock->sendFrame(testStr,strlen(testStr),WebSocket::FRAME_TEXT);
    std::cout << "Sent bytes " << len << std::endl;
    int flags=0;

    int rlen=m_psock->receiveFrame(receiveBuff,256,flags);
    std::cout << "Received bytes " << rlen << std::endl;
    std::cout << receiveBuff << std::endl;

    m_psock->close();
}

//--------------------------------------------------------------
void ofApp::update(){
    kinect.update();
}

//--------------------------------------------------------------
void ofApp::draw(){
    if (debugMode) {
        cam.begin();
        drawPointCloud();
        cam.end();
    } else {
        kinect.draw(0, 0, kinect.width/2, kinect.height/2);
        kinect.drawDepth(kinect.width/2, 0, kinect.width/2, kinect.height/2);
    }

}

//--------------------------------------------------------------
void ofApp::exit(){
    kinect.setCameraTiltAngle(0);
    kinect.close();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if (angle == 30 || angle == - 30) {
        return;
    }

    switch (key) {
        case OF_KEY_UP:
            angle++;
            break;

        case OF_KEY_DOWN:
            angle--;
            break;

        default:
            break;
    }

    kinect.setCameraTiltAngle(angle);
    
    switch (key) {
        case 'p':
            debugMode = !debugMode;
            break;
            
        default:
            break;
    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}

void ofApp::drawPointCloud() {
    ofMesh pointCloud;
    
    pointCloud.setMode(OF_PRIMITIVE_POINTS);
    
    for (int y = 0; y < kinect.height; y++) {
        for (int x = 0; x < kinect.width; x++) {
            ofVec3f point;
            
            point = kinect.getWorldCoordinateAt(x, y);
            
            if (point.z > nearClip && point.z < farClip) {
                pointCloud.addVertex(point);
                //            pointCloud.addColor(kinect.getColorAt(x, y));

//                ofColor col;
                // ofMap scale distance to a new range
//                col.setHsb(ofMap(point.z, 100, 8000, 0, 255), 255, 255);
//                pointCloud.addColor(col);
            }
        }
    }
    
    glPointSize(2);
    
    ofEnableDepthTest();
    
    ofPushMatrix();
    
    ofScale(1, -1, 1);
    ofTranslate(0, 0, -1000);
    pointCloud.drawVertices();
    
    ofPopMatrix();
    
    ofDisableDepthTest();
}
