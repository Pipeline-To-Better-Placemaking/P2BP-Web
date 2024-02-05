using UnityEngine;
using TMPro;
using System.Collections.Generic;
using System.Linq;
using UnityEngine.ProBuilder;
using UnityEngine.ProBuilder.MeshOperations;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices;

public class Generate : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void AdminButtons (int isContinue);

    public Vector3 screenPosition;
    public Vector3 worldPosition;
    public List<Vector3> vertices = new List<Vector3>();
    public List<GameObject> sphereList = new List<GameObject>();

    // Earth's radius in kilometers
    private const float EarthRadius = 6371e3f; 
    private const float avgFloorHeight = 14f;
    public float cameraSpeed = 5.0f;

    public Material material;

    // DragCamera dragCamera;

    [SerializeField] private TMP_InputField heightInputField;

    ProBuilderMesh mesh;
    ProBuilderMesh floorMesh;

    // public GameObject continueBtn;
    // public TMP_Text invalidPrompt;

    [System.Serializable]
    public class Building
    {
        public string numFloors;
        public latLng[] points;
    }

    [System.Serializable]
    public class latLng
    {
        public float lat;
        public float lng;
    }



    // Start is called before the first frame update
    void Start()
    {

        // dragCamera = Camera.main.gameObject.GetComponent<DragCamera>();
        // dragCamera.enabled = false;

        // mesh = ShapeGenerator.GeneratePlane(PivotLocation.Center, 10, 10, 0, 0, Axis.Backward);
        // var go1 = new GameObject();
        // // var go2 = new GameObject();
        
        // mesh = go1.gameObject.AddComponent<ProBuilderMesh>();
        // // floorMesh = go2.gameObject.AddComponent<ProBuilderMesh>();

        // // GetPoints(str);
        // // vertices.Add(new Vector3(2837.131f,-8152.318f,0));
        // // vertices.Add(new Vector3(2837.204f,-8152.132f,0));
        // // vertices.Add(new Vector3(2837.015f,-8152.168f,0));
        // vertices.Add(new Vector3(0,0,0));

        // // Long is the same (2nd para)
        // float testY1 = Distance(28.37131f, -81.52318f, 28.37204f, -81.52318f);
        // // Lat is the same (1st para)
        // float testX1 = Distance(28.37131f, -81.52318f ,28.37131f, -81.52132f);

        // // Long is the same (2nd para)
        // float testY2 = Distance(28.37204f, -81.52132f, 28.37015f, -81.52132f);
        // // Lat is the same (1st para)
        // float testX2 = Distance(28.37204f, -81.52132f , 28.37204f, -81.52168f);

        // vertices.Add(new Vector3(testX1, 0, testY1));
        // vertices.Add(new Vector3(testX2, 0, testY2));

        // mesh.CreateShapeFromPolygon(vertices, (avgFloorHeight*4), true);
        // mesh.tag = "Model";
        // mesh.GetComponent<MeshRenderer>().sharedMaterial = material;


        // mesh.ToMesh();
        // mesh.Refresh();

        // // Code below is to add floors meshes
        // // would have a counter here to replace the hardcoded 1
        // for (int j = 0; j < 4-1; j++)
        // {
        //     for(int i = 0; i < vertices.Count; i++)
        //     {
        //         var temp = vertices[i];
        //         temp.y = (avgFloorHeight*1) + temp.y;
        //         vertices[i] = temp;
        //         // Debug.Log(vertices[i]);
        //     }
        //     var tempMesh = new GameObject();
        //     floorMesh = tempMesh.gameObject.AddComponent<ProBuilderMesh>();
        //     floorMesh.CreateShapeFromPolygon(vertices, 0, false);
        //     floorMesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        //     floorMesh.ToMesh();
        //     floorMesh.Refresh();
        // }

        // // dragCamera.enabled = true;

        // Camera.main.transform.position = Vector3.Lerp(transform.position, mesh.GetComponent<MeshRenderer>().bounds.center, cameraSpeed * Time.deltaTime);
        // Camera.main.transform.LookAt(mesh.GetComponent<MeshRenderer>().bounds.center);

    }

    // private void LateUpdate()
    // {

    //     transform.position = Vector3.Lerp(transform.position, mesh.transform.position, cameraSpeed * Time.deltaTime);
    //     transform.LookAt(mesh.transform);
    // }

    public void GetPoints(string json)
    {
        var go = new GameObject();
        mesh = go.gameObject.AddComponent<ProBuilderMesh>();

        // dragCamera = Camera.main.gameObject.GetComponent<DragCamera>();
        // dragCamera.enabled = false;

        Debug.Log ($"{json}");
        Building data = JsonUtility.FromJson<Building>(json);

        Debug.Log ($"Info obj numFloors is: {data.numFloors} and points is: {data.points.Length}");
        int numFloors = int.Parse(data.numFloors);
        Debug.Log ($"The numFloors is: {numFloors}");
        

        // First vertex is the first longtitude point
        vertices.Add(new Vector3(0,0,0));
        float prevLat = 0;
        float prevLon = 0;
        float newLat, newLon;
        for (int i = 1; i < data.points.Length; i++)
        {
            float lat1 = data.points[i-1].lat;
            float lat2 = data.points[i].lat;
            float lon1 = data.points[i-1].lng;
            float lon2 = data.points[i].lng;

            float latDist = Distance(lat1, lon1, lat2, lon1);
            float lngDist = Distance(lat1, lon1, lat1, lon2);

            if (lat2 > lat1)
            {
                newLat = prevLat - latDist;
            }
            else
            {
                newLat = prevLat + latDist;
            }

            if (lon2 > lon1)
            {
                newLon = prevLon + lngDist;
            }
            else
            {
                newLon = prevLon - lngDist;
            }

            // Debug.Log($"newLat is: {newLat} and newLon is: {newLon}");

            vertices.Add(new Vector3(newLat, 0, newLon));
            prevLat = newLat;
            prevLon = newLon;
        }
        
        // int cnt = 0;
        // foreach (latLng p in data.points)
        // {

        //     vertices.Add(new Vector3(p.lat, p.lng, 0));
        //     Debug.Log ($"Lat is: {vertices[cnt].x} and lng is: {vertices[cnt].y}");
        //     cnt++;
        // }
        // Debug.Log ($"The points arr is: {vertices.Count}");
        
        if(mesh.CreateShapeFromPolygon(vertices, (avgFloorHeight * numFloors), true))
        {
            sendBoolean(1);
        }
        else { sendBoolean(0); }
        mesh.tag = "Model";

        // Move the camera to a position
        mesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        mesh.ToMesh();
        mesh.Refresh();

        // numFloors - 1 because you should only see two floors in the mesh of a building
        // with 3 floors
        for (int j = 0; j < numFloors - 1; j++)
        {
            // move the vertices up by a floor height
            for(int i = 0; i < vertices.Count; i++)
            {
                var temp = vertices[i];
                temp.y = (avgFloorHeight) + temp.y;
                vertices[i] = temp;
                // Debug.Log(vertices[i]);
            }
            // Build the floor mesh
            var tempMesh = new GameObject();
            floorMesh = tempMesh.gameObject.AddComponent<ProBuilderMesh>();
            floorMesh.CreateShapeFromPolygon(vertices, 0, false);
            floorMesh.GetComponent<MeshRenderer>().sharedMaterial = material;

            floorMesh.ToMesh();
            floorMesh.Refresh();
        }

        // dragCamera.enabled = true;

        Camera.main.transform.position = Vector3.Lerp(transform.position, mesh.GetComponent<MeshRenderer>().bounds.center, cameraSpeed * Time.deltaTime);
        Camera.main.transform.LookAt(mesh.GetComponent<MeshRenderer>().bounds.center);

        Debug.Log ("Ran through the code no problem");
    }

    public static float Distance(float lat1, float lon1, float lat2, float lon2)
    {
        float lat1Rad = DegreeToRadian(lat1);
        float lat2Rad = DegreeToRadian(lat2);
        float deltaLat = DegreeToRadian(lat2 - lat1);
        float deltaLon = DegreeToRadian(lon2 - lon1);

        float a = Mathf.Sin(deltaLat / 2) * Mathf.Sin(deltaLat / 2) +
                                                Mathf.Cos(lat1Rad) * Mathf.Cos(lat2Rad) *
                                                        Mathf.Sin(deltaLon / 2) * Mathf.Sin(deltaLon / 2);

        float c = 2 * Mathf.Atan2(Mathf.Sqrt(a), Mathf.Sqrt(1 - a));

        return EarthRadius * c;
    }

    private static float DegreeToRadian(float degree)
    {
        return degree * Mathf.PI / 180;
    }

    // communicates between Unity and React
    public void sendBoolean(int isContinue) {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
    AdminButtons (isContinue);
#endif
    }

    // public void resetBtn() 
    // {
    
    //     sendBoolean(0);
    // }

    // public void contBtn()
    // {
    //     sendBoolean(1);
    // }

    // Update is called once per frame
    // void Update()
    // {
    //     // screenPosition = Input.mousePosition;

    //     // Ray ray = Camera.main.ScreenPointToRay(screenPosition);

    //     // if (Physics.Raycast(ray, out RaycastHit hitData))
    //     // {
    //     //     worldPosition = hitData.point;
    //     //     if (Input.GetMouseButtonDown(0))
    //     //     {
    //     //         GameObject newSphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
    //     //         newSphere.transform.position = worldPosition;
    //     //         sphereList.Add(newSphere);
    //     //         worldPosition.z--;
    //     //         points.Add(worldPosition);
    //     //         // Debug.Log(points);
    //     //     }
    //     // }

    //     // transform.position = worldPosition;
    // }

    // // Delete the previous point the user put down
    // // public void onClickDeletePrevious()
    // // {
    // //     // Make sure that there is a point a user put down
    // //     if (points.Count > 0)
    // //     {
    // //         int delete3DNode = sphereList.Count - 1;
    // //         int deletePoint = points.Count - 1;

    // //         // Deletes the 3D object from Unity view, Gameobject data, and Vector3 object
    // //         points.RemoveAt(deletePoint);
    // //         Destroy(sphereList[delete3DNode]);
    // //         sphereList.RemoveAt(delete3DNode);
    // //     }
    // // }


    // // SOMETIMES EXTRUSION DOESN'T WORK FOR SOME REASON?
    // // UnityEditor.ProBuilder.ProBuilderMeshPreview was not disposed properly
    // // public void onClickExtrude()
    // // {
    // //     // Take in height user puts in
    // //     string strHeight = heightInputField.text;

    // //     // Parse the string into an integer. If you can, perform extrusion, otherwise throw error
    // //     if (int.TryParse(strHeight, out int numHeight))
    // //     {
    // //         // Debug.Log(numHeight);
    // //         if(!mesh.CreateShapeFromPolygon(points, numHeight, true))
    // //         {
    // //             Debug.Log("Invalid Polygon Shape");
    // //         }
    // //     }
    // //     else
    // //     {
    // //         Debug.Log($"Int32.TryParse could not parse '{strHeight}' to an int.");
    // //     }

    // // }

}

