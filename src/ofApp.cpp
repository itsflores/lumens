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
    
    // cloud
    pointCloud.setMode(OF_PRIMITIVE_POINTS);
    glPointSize(2);
    
    // sockets
    HTTPClientSession cs("localhost",8081);
    HTTPRequest request(HTTPRequest::HTTP_GET, "/?encoding=text",HTTPMessage::HTTP_1_1);
    request.set("origin", "/");
    HTTPResponse response;
    
    m_psock = new WebSocket(cs, request, response);
    
    std::thread backgroundThread(
      [this]() -> void {
        while(true) {
          this->sendCloud();
          this_thread::sleep_for(chrono::milliseconds(3000));
        }
      }
    );
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
//        sendCloud();
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
    
    for (int x = 0; x < kinect.width; x++) {
        for (int y = 0; y < kinect.height; y++) {
            ofVec3f point;
            
            point = kinect.getWorldCoordinateAt(x, y);
            
            if (point.z > nearClip && point.z < farClip) {
                pointCloud.addVertex(point);
                
//                ofColor col;
//                col.setHsb(ofMap(point.z, 100, 8000, 0, 255), 255, 255);
//                pointCloud.addColor(col);
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
    std::vector<string> localPoints;
    
    // Creates vector of "x:y:z" strings
    if (pointCloud.hasVertices()) {
        for (ofVec3f point : pointCloud.getVertices()) {
            std::string pointText = std::to_string(point.x)
                + ":"
                + std::to_string(point.y)
                + ":"
                + std::to_string(point.z);
            
            localPoints.push_back(pointText);
        }

//        std::cout << localPoints[0] << std::endl;
        
        const char* const delim = ",";

        std::ostringstream pointStream;
        std::copy(localPoints.begin(), localPoints.end(),
                  std::ostream_iterator<std::string>(pointStream, delim));
        
//        std::cout << pointsString.str() << std::endl;
        
        std::string pointString = pointStream.str();
        
        char *message = new char[pointString.length() + 1];
        std::copy(pointString.c_str(), pointString.c_str() + pointString.length() + 1, message);
        
        m_psock->sendFrame(message, strlen(message), WebSocket::FRAME_TEXT);
        std::cout << "sent!" << std::endl;
    }

    localPoints.clear();

//    char const *testStr = "{\"hi\":\"test\"}";
//
//    m_psock->sendFrame(testStr, strlen(testStr), WebSocket::FRAME_TEXT);
//    std::cout << "sent!" << std::endl;
    
    // receive code NOT NEEDED
//    char receiveBuff[256];
//    int flags=0;
//    m_psock->receiveFrame(receiveBuff, 256, flags);
//    std::cout << "received!" << std::endl;
//    std::cout << receiveBuff << std::endl;
}
