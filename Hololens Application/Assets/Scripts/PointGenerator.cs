using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using System.Threading;
using UnityEngine;
using UnityEngine.UIElements;
using WebSocketSharp;
using Debug = UnityEngine.Debug;

public class PointGenerator : MonoBehaviour
{
    public GameObject IP;
    public GameObject LastHologram;
    public GameObject Indicator;

    public GameObject spherePrefab;
    public GameObject crossPrefab;
    public GameObject exclMarkPrefab;
    public GameObject LeftArrowPrefab;
    public GameObject RightArrowPrefab;

    public Material hologramMaterial;

    bool arrowHidden = false;

    AddressScript IPscript;
    List<GameObject> createdPoints;

    private class Point
    {
        public float x;
        public float y;
        // optional shape field
        public string shape;
        public uint color;
        public float size;
        public byte transparency;


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
        IPscript = IP.GetComponent<AddressScript>();
        createdPoints = new List<GameObject>();
        string url = "wss://" + IPscript.address + ":8443/engiee/screen/clicks";
        ws = new WebSocket(url);
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
                    // remove holograms if message said so
                    if (p.shape == "removeLast")
                    {
                        removeLastPoint();
                        return;
                    }
                    else if (p.shape == "removeAll")
                    {
                        foreach (GameObject point in createdPoints)
                        {
                            Destroy(point);
                        }
                        createdPoints.Clear();
                        Indicator.SetActive(false);
                        return;
                    }


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
                    GameObject hologram;
                    if (p.shape == "sphere")
                    {
                        hologram = Instantiate(spherePrefab, hit.point, Quaternion.LookRotation(Camera.main.transform.forward));
                    }
                    else if (p.shape == "cross")
                    {
                        hologram = Instantiate(crossPrefab, hit.point, Quaternion.LookRotation(Camera.main.transform.forward));
                    }
                    else if (p.shape == "leftArrow")
                    {
                        hologram = Instantiate(LeftArrowPrefab, hit.point, Quaternion.LookRotation(Camera.main.transform.forward));
                    }
                    else if (p.shape == "rightArrow")
                    {
                        hologram = Instantiate(RightArrowPrefab, hit.point, Quaternion.LookRotation(Camera.main.transform.forward));
                    }
                    else
                    {
                        hologram = Instantiate(exclMarkPrefab, hit.point, Quaternion.LookRotation(Camera.main.transform.forward));
                    }

                    var scale = p.size / 100;
                    //hologram.transform.position = Camera.main.transform.position + Camera.main.transform.forward * 2; \\For testing
                    hologram.transform.localScale = new Vector3(scale, scale, scale);
                    Color32 hologramColor = new Color32((byte)(p.color >> 16), (byte)(p.color >> 8), (byte)p.color, p.transparency);

                    foreach (var rend in hologram.GetComponentsInChildren<Renderer>(true))
                    {
                        rend.material = hologramMaterial;
                        rend.material.color = hologramColor;

                    }
                    createdPoints.Add(hologram);

                    LastHologram.transform.position = hologram.transform.position;
                    if(arrowHidden == false)
                        Indicator.SetActive(true);

                    /*if (p.shape == "sphere")
                    {
                        GameObject sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                        sphere.transform.position = hit.point;
                        sphere.transform.localScale = new Vector3(0.05f, 0.05f, 0.05f);
                        sphere.GetComponent<Renderer>().material.color = new Color32((byte)(p.color >> 16), (byte)(p.color >> 8), (byte)p.color, 255);
						createdPoints.Add(sphere);
                    }
                    else
                    {
                        GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
                        cube.transform.position = hit.point;
                        cube.transform.localScale = new Vector3(0.05f, 0.05f, 0.05f);
                        cube.GetComponent<Renderer>().material.color = new Color32((byte)(p.color >> 16), (byte)(p.color >> 8), (byte)p.color, 255);
						createdPoints.Add(cube);
                    }
                    */
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
	
	public void removeLastPoint()
	{
		if(createdPoints.Any())
		{
            Destroy(createdPoints.Last());
            createdPoints.RemoveAt(createdPoints.Count - 1);
        }
        if (createdPoints.Any())
        {
            LastHologram.transform.position = createdPoints.Last().transform.position;
        }
        else
        {
            Indicator.SetActive(false);
        }

    }
	
	public void removeAllPoints()
	{
        foreach (GameObject point in createdPoints)
		{
			Destroy(point);
		}
        createdPoints.Clear();
        Indicator.SetActive(false);

    }

    public void hideArrow()
    {
        arrowHidden = true;
    }

    public void showArrow()
    {
        arrowHidden = false;
    }

}