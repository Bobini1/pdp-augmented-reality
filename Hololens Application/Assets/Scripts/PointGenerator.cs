using System;
using System.Collections;
using System.Threading;
using UnityEngine;
using WebSocketSharp;

public class PointGenerator : MonoBehaviour
{
    private class Point
    {
        public int x;
        public int y;
        
        public override string ToString()
        {
            return string.Format("({0}, {1})", x, y);
        }
    }
    
    WebSocket ws;
    // Start is called before the first frame update
    void Start()
    {
        ws = new WebSocket("wss://192.168.33.3:8443/engiee/camera/clicks");
        var camera = Camera.main;
        ws.OnMessage += (sender, e) =>
        {
            Debug.Log("Message Received from " + ((WebSocket)sender).Url + ", Data : " + e.Data);
            // parse json
            Point p = JsonUtility.FromJson<Point>(e.Data);
            Debug.Log("Point: " + p);
            Debug.Log("test");
            // raycast to point
            Ray ray;
            try
            {
                ExecuteOnMainThread.RunOnMainThread.Enqueue(() =>
                {
                    ray = camera.ScreenPointToRay(new Vector3(p.x, -p.y, 0));
                    Debug.Log("ray: " + ray);
                    // get hit point on a wall
                    RaycastHit hit;
                    if (Physics.Raycast(ray, out hit))
                    {
                        Debug.Log("Hit: " + hit.point);
                        // generate directional indicator
                        GameObject indicator = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                        indicator.transform.position = hit.point;
                        indicator.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
                    }
                });
            }
            catch (Exception ex)
            {
                Debug.Log(ex);
            }
        };
        ws.OnOpen += (sender, e) =>
        {
            Debug.Log("Connected to websocket");
        };
        ws.Connect();
    }

    // Update is called once per frame
    void Update()
    {

    }
}