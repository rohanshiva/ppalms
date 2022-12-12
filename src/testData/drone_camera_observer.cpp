#include "./drone_camera_observer.h"

// Constructor
DroneCameraObserver::DroneCameraObserver(int camera_id, ICameraController *controller) : id_(camera_id), controller_(controller)
{
    controller_->AddObserver(*this);
}

void DroneCameraObserver::TakePicture()
{
    controller_->TakePicture(id_);
}

// Processes images asynchonously.  The returned camera result will be passed into the ImageProcessingComplete(...) method
ICameraResult *DroneCameraObserver::ProcessImages(int camera_id, double x_pos,
                                                  double y_pos, double z_pos, const std::vector<RawCameraImage> &images, picojson::object &details) const
{
    if (camera_id == id_ || camera_id < 0)
    {
        // These will output the image to files.  Ultimately this is just for debugging:

        /*
        std::ofstream color_file("color.jpg", std::ios::out | std::ios::binary);
        color_file.write(reinterpret_cast<const char *>(images[0].data), images[0].length);
        std::ofstream depth_file("depth.jpg", std::ios::out | std::ios::binary);
        depth_file.write(reinterpret_cast<const char *>(images[1].data), images[1].length);
        */

        // read camera image as Image object
        Image drone_camera_image = Image((const unsigned char *)images[0].data, images[0].length);
        Image depth_image = Image((const unsigned char *)images[1].data, images[1].length);

        // run robot_detector on the drome camera image
        std::vector<Image *> detector_inputs;
        detector_inputs.push_back(&drone_camera_image);
        detector_inputs.push_back(&depth_image);

        RobotDetector robot_detector = RobotDetector();
        CameraResult robot_detector_result = robot_detector.Detect(detector_inputs, Vector3(x_pos, y_pos, z_pos));
        
        // populate result of checking if the robot existed in the images
        CameraResult *result = new CameraResult();
        result->found = robot_detector_result.found;
        result->pos[0] = robot_detector_result.pos[0];
        result->pos[1] = robot_detector_result.pos[1];
        result->pos[2] = robot_detector_result.pos[2];

        return result;
    }
    else
    {
        return NULL;
    }
}

// After the asynchronous image processing, this method will be synchronized with the update loop.
void DroneCameraObserver::ImageProcessingComplete(ICameraResult *result)
{
    CameraResult &res = *static_cast<CameraResult *>(result);
    if (res.found)
    {   
        // update the state to reflect that the robot has been found
        has_found_robot_ = true;
        robot_pos_ = Vector3(res.pos[0], res.pos[1], res.pos[2]);
    }
    delete result;
}

bool DroneCameraObserver::IsRobotFound()
{
    return has_found_robot_;
}

Vector3 DroneCameraObserver::GetRobotPosition()
{
    return robot_pos_;
}