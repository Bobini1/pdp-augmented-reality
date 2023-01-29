using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class StartQRCodesManager : MonoBehaviour
{
    public GameObject manager;
    DateTime start;
    bool count;

    // Start is called before the first frame update
    void Start()
    {
        start = DateTime.Now;
        count = true;
    }

    // Update is called once per frame
    void Update()
    {
        if(count)
        {
            TimeSpan time = DateTime.Now - start;
            if ((int)time.TotalSeconds >= 5)
            {
                manager.SetActive(false);
                count = false;
            }
        }
    }
}
