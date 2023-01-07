using System;
using System.Collections;
using System.Diagnostics;
using System.Threading;
using UnityEngine;
using UnityEngine.UIElements;
using WebSocketSharp;
using Debug = UnityEngine.Debug;

public class PointGenerator : MonoBehaviour
{
    private class Point
    {
        public float x;
        public float y;
        // optional shape field
        public string shape;
        public uint color;

        public override string ToString()
        {
            return string.Format("({0}, {1})", x, y);
        }
        
        public void RescaleX(float scale)
        {
            x = (x - 0.5f) * scale + 0.5f;
        }
        public void RescaleY(float scale)
        {
            y = (y - 0.5f) * scale + 0.5f;
        }
    }
    
    WebSocket ws;
    // Start is called before the first frame update
    void Start()
    {
        ws = new WebSocket("wss://192.168.18.6:8443/engiee/screen/clicks");
        var camera = Camera.main;
        ws.OnMessage += (sender, e) =>
        {
            Debug.Log("Message Received from " + ((WebSocket)sender).Url + ", Data : " + e.Data);
            // parse json
            Point p = JsonUtility.FromJson<Point>(e.Data);
            // calibration
            p.y = 1 - p.y - 0.055f;
            p.x += 0.025f;
            p.RescaleX(2.8f);
            p.RescaleY(1.6f);
            Debug.Log("Point: " + p);
            // raycast to point
            Ray ray;
            try
            {
                ExecuteOnMainThread.RunOnMainThread.Enqueue(() =>
                {
                    var x = (int)(p.x * Screen.width);
                    var y = (int)(p.y * Screen.height);
                    ray = camera.ScreenPointToRay(new Vector3(x, y, 0));
                    // adjust ray angle
                    Debug.Log("ray: " + ray);
                    // get hit point on a wall
                    RaycastHit hit;
                    if (!Physics.Raycast(ray, out hit)) return;
                    Debug.Log("Hit: " + hit.point);
                    // generate directional indicator
                    if (p.shape == "sphere")
                    {
                        GameObject sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                        sphere.transform.position = hit.point;
                        sphere.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
                        sphere.GetComponent<Renderer>().material.color = new Color32((byte)(p.color >> 16), (byte)(p.color >> 8), (byte)p.color, 255);
                    }
                    else
                    {
                        GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        cube.transform.position = hit.point;
                        cube.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
                        cube.GetComponent<Renderer>().material.color = new Color32((byte)(p.color >> 16), (byte)(p.color >> 8), (byte)p.color, 255);
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