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
    kinect.setCameraTiltAngle(0);
    
    debugMode = false;
    emit = false;
    
    // milimeters
    nearClip = 500;
    farClip = 2900;
//    farClip = 1500;
    
    // cloud
    pointCloud.setMode(OF_PRIMITIVE_POINTS);
    glPointSize(10);
//    glPointSize(1);
    glEnable(GL_POINT_SMOOTH);
    
    ofBackground(0, 0, 0);
    
    // sockets
    HTTPClientSession cs("localhost",8081);
    HTTPRequest request(HTTPRequest::HTTP_GET, "/?encoding=text",HTTPMessage::HTTP_1_1);
    request.set("origin", "/");
    HTTPResponse response;
    m_psock = new WebSocket(cs, request, response);
    
    std::thread backgroundThread(
    [this]() -> void {
        while(true) {
            if (emit) {
                this->sendCloud();
            }
            this_thread::sleep_for(chrono::milliseconds(150));
        }
    });
    backgroundThread.detach();
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
    m_psock->close();
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
            
        case 'p':
            debugMode = !debugMode;
            break;
            
        case 'e':
            emit = !emit;
            break;
            
        case 's':
            sendCloud();
            break;

        default:
            break;
    }

    kinect.setCameraTiltAngle(angle);
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
    pointCloud.clear();
    int step = 10;
    
    for (int x = 0; x < kinect.width; x += step) {
        for (int y = 0; y < kinect.height; y+= step) {
            ofVec3f point;
            
            point = kinect.getWorldCoordinateAt(x, y);
            
            if (point.z > nearClip && point.z < farClip) {
                ofColor col;
                col.setHsb(ofMap(point.z, 100, 8000, 0, 255), 255, 255);
                pointCloud.addColor(col);
                pointCloud.addVertex(point);
            }
        }
    }
    
    ofEnableDepthTest();
    ofPushMatrix();
    ofScale(1, -1, 1);
    ofTranslate(0, 0, -1000);
    
    pointCloud.drawVertices();
    
    ofPopMatrix();
    ofDisableDepthTest();
}

void ofApp::sendCloud() {
    std::string pointString = "";
    std::stringstream pointStream;
    
    if (pointCloud.hasVertices()) {
        for (ofVec3f point : pointCloud.getVertices()) {
            int xInt = static_cast<int>(point.x);
            int yInt = static_cast<int>(point.y);
            int zInt = static_cast<int>(point.z);
            
            std::stringstream singlePoint;
            singlePoint << "{\"minX\":" << xInt << ",\"minY\":" << yInt << ",\"minZ\":" << zInt << ",\"maxX\":" << xInt << ",\"maxY\":" << yInt << ",\"maxZ\":" << zInt << "}";
            
            pointStream << singlePoint.rdbuf() << ",";
        }
    }
    
    std::string pointsArray = pointStream.str();
    
    if (pointsArray.length() > 0) {
        pointsArray.pop_back();
    }
    
    pointString = "[" + pointsArray + "]";
    
    char *message = new char[pointString.length() + 1];
    
    std::copy(pointString.c_str(), pointString.c_str() + pointString.length() + 1, message);
   
    m_psock->sendFrame(message, int(strlen(message)), WebSocket::FRAME_TEXT);
}
