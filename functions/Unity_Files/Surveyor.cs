using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.ProBuilder;
using UnityEngine.ProBuilder.MeshOperations;
using TMPro;
using Newtonsoft.Json;
using System.Runtime.InteropServices;
using UnityEngine.EventSystems;

public class Surveyor : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void ReceiveProgramData(string programJSON);

    ProBuilderMesh mesh;
    ProBuilderMesh newProgramMesh;
    ProBuilderMesh floorMesh;
    ProBuilderMesh loadedProgramMesh;

    private const float EarthRadius = 6371e3f;

    public float dragSpeed = 2;
    private Vector3 dragOrigin;
    public bool cameraDragging = false;
    public float outerLeft = -10f;
    public float outerRight = 10f;
    private int type;

    public static int idCounter = 0;
    private bool selectedProgramDelete = false;
    private int numNewPrograms = 0;
    private GameObject programToDelete;
    private Material materialToSave;

    public Material material;

    DragCamera dragCamera;

    public List<Vector3> vertices = new List<Vector3>();
    public List<Vector3> inputPoints = new List<Vector3>();

    List<GameObject> DotList = new List<GameObject>();
    List<ProBuilderMesh> floorList = new List<ProBuilderMesh>();

    public GameObject extrudeUIBox;
    public GameObject previewUIBox;
    public GameObject startUIBox;
    public GameObject addProgramBtn;
    public GameObject deleteUIBox;
    public GameObject deleteProgramBtn;
    public GameObject submitProgramBtn;
    public GameObject previewAcceptButton;
    public GameObject invalidShapeText;
    public TMP_Text indicateTextForExtrude;
    public GameObject deleteButtonsContainer;
    public GameObject deleteCancelButton;
    public GameObject deleteText;
    public GameObject deleteConfirmText;
    public GameObject submitIndicateText;
    public TMP_Text submitAllProgramsText;




    public GameObject dot;




    // [SerializeField] private TMPro.TMP_InputField floorNumber;
    public TMP_Dropdown floorNumberDropDown;
    [SerializeField] public string programOption;

    public Material food, entertain, hospitality, health, retail, commercial, residential, lab, storage, empty, civil, monument, publicSpace, voidSpace, deleteMat;

    IDictionary<string, Material> programMapping;

    [System.Serializable]
    public class Building
    {
        public string numFloors;
        public latLng[] points;
        public LoadingPrograms[] programs;
        public string type;
    }

    [System.Serializable]
    public class latLng
    {
        public float lat;
        public float lng;
    }

    [System.Serializable]
    public class LoadingPrograms
    {
        public string programType;
        public LoadingCoords[] programPointsList;
    }

    [System.Serializable]
    public class LoadingCoords
    {
        public float xCoord;
        public float yCoord;
        public float zCoord;
    }

    [System.Serializable]
    class Program
    {
        public List<Coordinate> points = new List<Coordinate>();
        public string programType;
        public int floorNum;
        public float sqFootage;
        public int programID;

        public Program(string programType, List<Vector3> _points, int floorNum, float sqFootage)
        {
            this.programType = programType;
            this.floorNum = floorNum;
            this.sqFootage = sqFootage;
            this.programID = idCounter;
            idCounter++;

            Debug.Log(this.floorNum);
            for (int i = 0; i < _points.Count; i++)
            {
                // Debug.Log("xcoord is: " + _points[i].x);
                // Debug.Log("ycoord is: " + _points[i].y);
                // Debug.Log("zcoord is: " + _points[i].z);
                points.Add(new Coordinate(_points[i].x, _points[i].y, _points[i].z));
            }

        }
    }
    [System.Serializable]
    class Coordinate
    {
        public float xCoord, yCoord, zCoord;
        public Coordinate(float xCoord, float yCoord, float zCoord)
        {
            this.xCoord = xCoord;
            this.yCoord = yCoord;
            this.zCoord = zCoord;
        }
    }

    List<Program> programList = new List<Program>();

    // private Ray _ray;
    // private RaycastHit _hit;

    public Vector3 screenPosition;
    public Vector3 worldPosition;

    // int numFloors = 3;
    int currentFloorShown = 0;
    bool validFloorNum = false;
    // Start is called before the first frame update
    void Start()
    {
        // PopulateFloorNumDropDown(3);

        // var go = new GameObject();
        // mesh = go.gameObject.AddComponent<ProBuilderMesh>();

        // mesh.gameObject.AddComponent<MeshCollider>();

        // vertices.Add(new Vector3(0, 0, 0));
        // vertices.Add(new Vector3(0, 0, 100));
        // vertices.Add(new Vector3(100, 0, 100));
        // vertices.Add(new Vector3(100, 0, 0));

        // mesh.CreateShapeFromPolygon(vertices, 42, true);

        // mesh.tag = "Model";
        // mesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        // mesh.ToMesh();
        // mesh.Refresh();
        // // mesh.gameObject.SetActive(false);

        // var tempTemp = new GameObject();
        // floorMesh = tempTemp.gameObject.AddComponent<ProBuilderMesh>();
        // floorMesh.gameObject.AddComponent<MeshCollider>();

        // floorMesh.CreateShapeFromPolygon(vertices, 0, false);
        // floorMesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        // floorMesh.ToMesh();
        // floorMesh.Refresh();
        // floorMesh.gameObject.SetActive(false);

        // floorList.Add(floorMesh);

        // for (int j = 1; j < 3; j++)
        // {
        //     for (int i = 0; i < vertices.Count; i++)
        //     {
        //         var temp = vertices[i];
        //         temp.y = (14) + temp.y;
        //         vertices[i] = temp;
        //         // Debug.Log(vertices[i]);
        //     }
        //     var tempMesh = new GameObject();
        //     floorMesh = tempMesh.gameObject.AddComponent<ProBuilderMesh>();
        //     floorMesh.gameObject.AddComponent<MeshCollider>();

        //     floorMesh.CreateShapeFromPolygon(vertices, 0, false);
        //     floorMesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        //     floorMesh.ToMesh();
        //     floorMesh.Refresh();
        //     // floorMesh.gameObject.SetActive(false);

        //     floorList.Add(floorMesh);
        // }

        // // floorList[1].gameObject.SetActive(true);

        // dragCamera = Camera.main.gameObject.GetComponent<DragCamera>();

        // programMapping = new Dictionary<string, Material>(){
        // {"Food and beverage", food},
        // {"Entertainment / leisure", entertain},
        // {"Hospitality", hospitality},
        // {"Healthcare", health},
        // {"Retail", retail},
        // {"Commercial", commercial},
        // {"Residential", residential},
        // {"Laboratory", lab},
        // {"Storage / warehouse", storage},
        // {"Empty / abandoned / unused", empty},
        // {"Civil", civil},
        // {"Monument", monument},
        // {"Public Space", publicSpace},
        // {"Void Space", voidSpace}
        // };

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

    public void SurveyorProgram(string json)
    {
        Debug.Log(json);


        dragCamera = Camera.main.gameObject.GetComponent<DragCamera>();
        // submitProgramBtn.SetActive(false);

        programMapping = new Dictionary<string, Material>(){
        {"Food and beverage", food},
        {"Entertainment / leisure", entertain},
        {"Hospitality", hospitality},
        {"Healthcare", health},
        {"Retail", retail},
        {"Commercial", commercial},
        {"Residential", residential},
        {"Laboratory", lab},
        {"Storage / warehouse", storage},
        {"Empty / abandoned / unused", empty},
        {"Civil", civil},
        {"Monument", monument},
        {"Public Space", publicSpace},
        {"Void Space", voidSpace}
        };


        var go = new GameObject();
        mesh = go.gameObject.AddComponent<ProBuilderMesh>();

        // dragCamera = Camera.main.gameObject.GetComponent<DragCamera>();
        // dragCamera.enabled = false;

        // Debug.Log ($"{json}");
        Building data = JsonUtility.FromJson<Building>(json);

        type = int.Parse(data.type);

        if (type == 1)
        {
            addProgramBtn.SetActive(false);
            submitAllProgramsText.text = "Done";
        }

        // Debug.Log ($"Info obj numFloors is: {data.numFloors} and points is: {data.points.Length}");
        int numFloors = int.Parse(data.numFloors);
        // Debug.Log ($"The numFloors is: {numFloors}");

        Debug.Log($"Programs[0] programType is: {data.programs[0].programType}");

        PopulateFloorNumDropDown(numFloors);

        // First vertex is the first longtitude point
        vertices.Add(new Vector3(0, 0, 0));
        float prevLat = 0;
        float prevLon = 0;
        float newLat, newLon;
        for (int i = 1; i < data.points.Length; i++)
        {
            float lat1 = data.points[i - 1].lat;
            float lat2 = data.points[i].lat;
            float lon1 = data.points[i - 1].lng;
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

            Debug.Log($"newLat is: {newLat} and newLon is: {newLon}");

            vertices.Add(new Vector3(newLat, 0, newLon));
            prevLat = newLat;
            prevLon = newLon;
        }

        mesh.CreateShapeFromPolygon(vertices, numFloors * 14, true);
        mesh.tag = "Model";
        mesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        mesh.ToMesh();
        mesh.Refresh();

        // for (int j = 0; j < numFloors - 1; j++)
        // {
        //     // move the vertices up by a floor height
        //     for(int i = 0; i < vertices.Count; i++)
        //     {
        //         var temp = vertices[i];
        //         temp.y = (avgFloorHeight) + temp.y;
        //         vertices[i] = temp;
        //         // Debug.Log(vertices[i]);
        //     }
        //     // Build the floor mesh
        //     var tempMesh = new GameObject();
        //     floorMesh = tempMesh.gameObject.AddComponent<ProBuilderMesh>();
        //     floorMesh.CreateShapeFromPolygon(vertices, 0, true);
        //     floorMesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        //     floorMesh.ToMesh();
        //     floorMesh.Refresh();
        // }
        // mesh.gameObject.SetActive(false);

        var tempTemp = new GameObject();
        floorMesh = tempTemp.gameObject.AddComponent<ProBuilderMesh>();
        floorMesh.gameObject.AddComponent<MeshCollider>();

        floorMesh.CreateShapeFromPolygon(vertices, 0, false);
        floorMesh.GetComponent<MeshRenderer>().sharedMaterial = material;

        floorMesh.ToMesh();
        floorMesh.Refresh();
        // floorMesh.gameObject.SetActive(false);

        floorList.Add(floorMesh);

        for (int j = 1; j < numFloors; j++)
        {
            for (int i = 0; i < vertices.Count; i++)
            {
                var temp = vertices[i];
                temp.y = (14) + temp.y;
                vertices[i] = temp;
                // Debug.Log(vertices[i]);
            }
            var tempMesh = new GameObject();
            floorMesh = tempMesh.gameObject.AddComponent<ProBuilderMesh>();
            floorMesh.gameObject.AddComponent<MeshCollider>();

            floorMesh.CreateShapeFromPolygon(vertices, 0, false);
            floorMesh.GetComponent<MeshRenderer>().sharedMaterial = material;

            floorMesh.ToMesh();
            floorMesh.Refresh();
            // floorMesh.gameObject.SetActive(false);

            floorList.Add(floorMesh);
        }

        // Load any existing programs
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // the savedYCoord might come with bugs, <--- Just in case you need debugging help !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        for (int i = 0; i < data.programs.Length; i++)
        {
            // scary "vertices.Clear()"
            vertices.Clear();
            int savedYCoord = (((int)data.programs[i].programPointsList[0].yCoord) / 14);
            for (int j = 0; j < data.programs[i].programPointsList.Length; j++)
            {

                vertices.Add(new Vector3(data.programs[i].programPointsList[j].xCoord, data.programs[i].programPointsList[j].yCoord, data.programs[i].programPointsList[j].zCoord));

            }
            var tempMesh = new GameObject();
            loadedProgramMesh = tempMesh.gameObject.AddComponent<ProBuilderMesh>();
            loadedProgramMesh.gameObject.transform.SetParent(floorList[savedYCoord].gameObject.transform);

            // Maybe we put this line in later (to help make sure programs don't overlap?)
            // loadedProgramMesh.gameObject.AddComponent<MeshCollider>();

            loadedProgramMesh.CreateShapeFromPolygon(vertices, 13.99f, false);
            loadedProgramMesh.GetComponent<MeshRenderer>().sharedMaterial = programMapping[data.programs[i].programType];
            loadedProgramMesh.gameObject.AddComponent<MeshCollider>();

            if (type == 1)
            {
                loadedProgramMesh.gameObject.tag = "Program";
            }
            else { loadedProgramMesh.gameObject.tag = "LoadedProgram"; }

            loadedProgramMesh.gameObject.AddComponent<ProgramIDComponent>();
            loadedProgramMesh.gameObject.GetComponent<ProgramIDComponent>().programID = idCounter;

            loadedProgramMesh.ToMesh();
            loadedProgramMesh.Refresh();

            programList.Add(new Program(data.programs[i].programType, vertices, savedYCoord, (float)ShoelaceFormula(vertices)));

        }

        if (programList.Count > 0)
        {
            deleteProgramBtn.SetActive(true);
        }


    }

    void PopulateFloorNumDropDown(int numFloors)
    {
        List<string> floors = new List<string>();
        floors.Add("Indicate floor Number for Program");
        for (int i = 0; i < numFloors; i++)
        {
            floors.Add((i + 1).ToString());
        }
        floorNumberDropDown.AddOptions(floors);

    }

    public void FloorDropdown_IndexChanged(int index)
    {
        // Change the view of which floor is being displayed
        if (index != 0)
        {
            inputPoints.Clear();
            validFloorNum = true;

            foreach (GameObject dot in DotList)
            {
                Destroy(dot);
            }
            DotList.Clear();
            floorList[currentFloorShown].gameObject.SetActive(false);
            floorList[index - 1].gameObject.SetActive(true);

            currentFloorShown = index - 1;
            Debug.Log(index);
            // Add code here to move the camera around
            Vector3 curFloor = floorList[currentFloorShown].GetComponent<MeshRenderer>().bounds.center;

            Camera.main.transform.position = new Vector3(curFloor.x, curFloor.y + 50, curFloor.z);
        }
        else
        {
            validFloorNum = false;
        }

    }

    void CameraStuff()
    {
        if (Input.GetMouseButtonDown(1))
        {
            dragOrigin = Input.mousePosition;
        }
        // Debug.Log(dragOrigin);
        if (Input.GetMouseButton(1))
        {
            Vector3 difference = Input.mousePosition - dragOrigin;
            Vector3 pan = new Vector3(difference.x * 0.05f, 0, difference.y * 0.05f);
            pan = Quaternion.Euler(0f, Camera.main.transform.eulerAngles.y, 0f) * pan;

            Camera.main.transform.position -= pan;
            dragOrigin = Input.mousePosition;
        }

        if (!EventSystem.current.IsPointerOverGameObject())
        {
            if (Input.mouseScrollDelta.y > 0 && Camera.main.transform.position.y > 10)
            {
                Camera.main.transform.position = new Vector3(Camera.main.transform.position.x, Camera.main.transform.position.y - 5, Camera.main.transform.position.z);
            }
            else if (Input.mouseScrollDelta.y < 0)
            {
                Camera.main.transform.position = new Vector3(Camera.main.transform.position.x, Camera.main.transform.position.y + 5, Camera.main.transform.position.z);
            }
        }


    }

    void RotateStuff()
    {
        if (Input.GetKey(KeyCode.LeftShift) && Input.GetKey(KeyCode.Mouse2))
        {
            float horizontal = Input.GetAxis("Mouse X") * 1.5f;
            Camera.main.transform.Rotate(0, 0, horizontal);

        }
    }

    // Update is called once per frame
    void Update()
    {
        if (extrudeUIBox.gameObject.activeInHierarchy)
        {
            screenPosition = Input.mousePosition;

            Ray ray = Camera.main.ScreenPointToRay(screenPosition);

            CameraStuff();
            RotateStuff();



            if (Physics.Raycast(ray, out RaycastHit hitData))
            {

                worldPosition = hitData.point;
                // Debug.Log(worldPosition);

                // worldPosition.y = Camera.main.transform.position.y;


                // float safeYCoord = worldPosition.y;
                if (Input.GetMouseButtonDown(0))
                {
                    if (!EventSystem.current.IsPointerOverGameObject() && (hitData.transform.tag != "Program" && hitData.transform.tag != "LoadedProgram"))
                    {
                        // Debug.Log(hitData.transform.gameObject.GetComponent<ProgramIDComponent>().programID);


                        // GameObject newSphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                        // newSphere.transform.position = worldPosition;
                        // sphereList.Add(newSphere);
                        // worldPosition.z--;
                        // points.Add(worldPosition);
                        // Debug.Log("hitDATA.point: " + hitData.point);
                        // Debug.Log("Added point with x-coordinate value: " + worldPosition.x);
                        // Debug.Log("Added point with y-coordinate value: " + worldPosition.y);
                        inputPoints.Add(worldPosition);

                        // Debug.Log(worldPosition);

                        // Add code to display where the user clicked with a dot

                        // !!!! Duplicate the dot mesh so that it renders a new dot everytime
                        // !!!! Fix the position of the dot when the user clicks

                        GameObject newDot = Instantiate(dot);


                        // newDot.gameObject.transform.position = new Vector3(0,0,0);
                        newDot.gameObject.transform.position = worldPosition;
                        DotList.Add(newDot);
                    }

                }
            }

            transform.position = worldPosition;
        }
        else if (deleteUIBox.gameObject.activeInHierarchy)
        {
            screenPosition = Input.mousePosition;

            Ray ray = Camera.main.ScreenPointToRay(screenPosition);

            if (Physics.Raycast(ray, out RaycastHit hitData))
            {
                if (Input.GetMouseButtonDown(0))
                {
                    if (selectedProgramDelete != true && hitData.transform.tag == "Program")
                    {
                        deleteText.SetActive(false);
                        deleteConfirmText.SetActive(true);

                        deleteCancelButton.SetActive(false);
                        deleteButtonsContainer.SetActive(true);

                        selectedProgramDelete = true;
                        programToDelete = hitData.transform.gameObject;

                        materialToSave = programToDelete.GetComponent<MeshRenderer>().sharedMaterial;
                        programToDelete.GetComponent<MeshRenderer>().sharedMaterial = deleteMat;

                    }
                }
            }
        }
    }

    // Add a new function here to receive the JSON from the website
    // of the vertices made by the admin, and any pre-existing programs
    // that may have came with it.



    // communicates between Unity and React
    public void sendProgramJSON(string data)
    {
#if UNITY_WEBGL == true && UNITY_EDITOR == false
    ReceiveProgramData (data);
#endif
    }


    // Everything here is good I believe
    public void NewProgramBtn()
    {
        inputPoints.Clear();
        foreach (GameObject dot in DotList)
        {
            Destroy(dot);
        }
        DotList.Clear();

        dragCamera.enabled = false;
        // currentFloorShown = 0;
        startUIBox.SetActive(false);
        mesh.gameObject.SetActive(false);

        for (int i = 0; i < floorList.Count; i++)
        {
            floorList[i].gameObject.SetActive(false);
        }

        floorList[currentFloorShown].gameObject.SetActive(true);
        extrudeUIBox.SetActive(true);

        Vector3 curFloor = floorList[currentFloorShown].GetComponent<MeshRenderer>().bounds.center;


        Camera.main.transform.rotation = Quaternion.identity;

        Camera.main.transform.position = new Vector3(curFloor.x, curFloor.y + 50, curFloor.z);
        Camera.main.transform.Rotate(Vector3.right, 90f);
    }

    public void deleteProgramButton()
    {
        startUIBox.SetActive(false);
        deleteUIBox.SetActive(true);
        submitIndicateText.SetActive(false);
    }

    public void deleteCancelBtn()
    {
        startUIBox.SetActive(true);
        deleteUIBox.SetActive(false);
    }

    public void deleteNoBtn()
    {
        deleteText.SetActive(true);
        deleteConfirmText.SetActive(false);

        deleteCancelButton.SetActive(true);
        deleteButtonsContainer.SetActive(false);

        selectedProgramDelete = false;

        programToDelete.GetComponent<MeshRenderer>().sharedMaterial = materialToSave;
    }

    public void deleteYesBtn()
    {

        int num = programToDelete.GetComponent<ProgramIDComponent>().programID;
        for (int i = 0; i < programList.Count; i++)
        {
            if (programList[i].programID == num)
            {
                programList.RemoveAt(i);
                break;
            }
        }
        Destroy(programToDelete);
        selectedProgramDelete = false;

        deleteText.SetActive(true);
        deleteConfirmText.SetActive(false);

        deleteCancelButton.SetActive(true);
        deleteButtonsContainer.SetActive(false);

        deleteUIBox.SetActive(false);
        startUIBox.SetActive(true);

        numNewPrograms--;

        if (programList.Count <= 0)
        {
            // submitProgramBtn.SetActive(false);
            deleteProgramBtn.SetActive(false);
        }

        if (type == 1)
        {
            submitAllProgramsText.text = "Update Model";
        }
    }

    public void UndoBtn()
    {
        if (inputPoints.Count > 0)
        {
            int deleteDot = DotList.Count - 1;
            int deletePoint = inputPoints.Count - 1;

            // Deletes the 3D object from Unity view, Gameobject data, and Vector3 object
            inputPoints.RemoveAt(deletePoint);
            Destroy(DotList[deleteDot]);
            DotList.RemoveAt(deleteDot);
        }
    }

    // Here is for packaging the JSON and sending it back to the website
    // Maybe have a flag variable so that the website moves on to the next page after the Unity page
    public void SubmitAllPrograms()
    {
        if (numNewPrograms > 0 || type == 1)
        {
            Debug.Log("Yay!");
            startUIBox.SetActive(false);


            string str = JsonConvert.SerializeObject(programList, Formatting.Indented);
            Debug.Log(str);
            sendProgramJSON(str);
        }
        else
        {
            submitIndicateText.SetActive(true);
        }

    }

    // Add code to put the programs on different floors
    // Change floorNumber input field to a dropdown like Jacob said --> DONE
    //  |__---> Toggle which floor plans are visible (and programs) --> DONE
    // Build/Extrude program into the proper floor (changing the y-coord) --> DONE
    // Check if the mesh was a valid mesh ---> if(newProgramMesh.CreateShapeFromPolygon(.....)) then proceed

    // Enable showing programMeshes on a floor by setting the programMesh as a child of the floorMesh --> DONE

    public void OnClickButton()
    {
        // floorNumber.text != "" &&
        if (programOption != "Please select program type" && programOption != "" && validFloorNum && inputPoints.Count > 2)
        {
            // int inputFloorNum = int.Parse(floorNumber.text);

            extrudeUIBox.SetActive(false);
            previewUIBox.SetActive(true);

            mesh.gameObject.SetActive(true);
            for (int i = 0; i < floorList.Count; i++)
            {
                floorList[i].gameObject.SetActive(true);
            }

            dragCamera.enabled = true;


            var go = new GameObject();
            newProgramMesh = go.gameObject.AddComponent<ProBuilderMesh>();
            newProgramMesh.gameObject.transform.SetParent(floorList[currentFloorShown].gameObject.transform);


            // 13.99 is just how far to extrude, less than the standard 14 units we are using
            if (newProgramMesh.CreateShapeFromPolygon(inputPoints, 13.99f, false))
            {

                newProgramMesh.GetComponent<MeshRenderer>().sharedMaterial = programMapping[programOption];
                newProgramMesh.gameObject.AddComponent<MeshCollider>();
                newProgramMesh.gameObject.tag = "Program";
                newProgramMesh.gameObject.AddComponent<ProgramIDComponent>();
                newProgramMesh.gameObject.GetComponent<ProgramIDComponent>().programID = idCounter;
                previewAcceptButton.SetActive(true);


            }
            else
            {
                invalidShapeText.SetActive(true);
            }

            indicateTextForExtrude.gameObject.SetActive(false);
            // Set the parent of the program of newProgramMesh to specific floor number mesh


        }
        else
        {
            if (programOption == "Please select program type" || programOption == "")
            {
                indicateTextForExtrude.gameObject.SetActive(true);
                indicateTextForExtrude.text = "Input a valid program type";
            }
            else if (!validFloorNum)
            {
                indicateTextForExtrude.gameObject.SetActive(true);
                indicateTextForExtrude.text = "Input a valid floor number";
            }
            else
            {
                indicateTextForExtrude.gameObject.SetActive(true);
                indicateTextForExtrude.text = "Input at least 3 points";
            }
        }

    }

    // Everything here is good
    public void PreviewCancelBtn()
    {
        Destroy(newProgramMesh.gameObject);
        inputPoints.Clear();
        foreach (GameObject dot in DotList)
        {
            Destroy(dot);
        }
        DotList.Clear();



        dragCamera.enabled = false;
        Camera.main.transform.rotation = Quaternion.identity;

        mesh.gameObject.SetActive(false);
        for (int i = 0; i < floorList.Count; i++)
        {
            floorList[i].gameObject.SetActive(false);
        }

        floorList[currentFloorShown].gameObject.SetActive(true);


        Vector3 curFloor = floorList[currentFloorShown].GetComponent<MeshRenderer>().bounds.center;

        Camera.main.transform.position = new Vector3(curFloor.x, curFloor.y + 50, curFloor.z);
        Camera.main.transform.Rotate(Vector3.right, 90f);



        previewUIBox.SetActive(false);
        extrudeUIBox.SetActive(true);
        previewAcceptButton.SetActive(false);
        invalidShapeText.SetActive(false);
    }

    public void PreviewAcceptBtn()
    {
        // Add the points of the current mesh to a list that will be packaged in a JSON later

        programList.Add(new Program(programOption, inputPoints, currentFloorShown, (float)ShoelaceFormula(inputPoints)));
        // Debug.Log(programList[0]);
        // Debug.Log(programList);
        // Debug.Log (CalculateArea(inputPoints));

        inputPoints.Clear();
        foreach (GameObject dot in DotList)
        {
            Destroy(dot);
        }
        DotList.Clear();

        previewUIBox.SetActive(false);
        startUIBox.SetActive(true);
        previewAcceptButton.SetActive(false);
        submitIndicateText.SetActive(false);

        numNewPrograms++;

        if (programList.Count > 0)
        {
            submitProgramBtn.SetActive(true);
            deleteProgramBtn.SetActive(true);
        }

        // Bring user to the main UI where they can start to add a new program or submit the programs they created.
        // Move camera
        // mesh.gameObject.SetActive(true);
        // for (int i = 0; i < floorList.Count; i++)
        // {
        //     floorList[i].gameObject.SetActive(true);
        // }
        // Camera.main.transform.position = new Vector3(0,0,0);
        // Camera.main.transform.Rotate(Vector3.left, 90f);
    }

    public static float ShoelaceFormula(List<Vector3> inputPoints)
    {
        float sum = 0f;
        int j = inputPoints.Count - 1;

        for (int i = 0; i < inputPoints.Count; i++)
        {
            sum += (inputPoints[j].x + inputPoints[i].x) * (inputPoints[j].z - inputPoints[i].z);
            j = i;
        }
        float areaInSquareMeters = Mathf.Abs(sum / 2.0f);
        float areaInSquareFeet = areaInSquareMeters * 10.7639f;
        return areaInSquareFeet;
    }


    public static double CalculateArea(List<Vector3> inputPoints)
    {
        // Add the first point to the end of the list to create a closed loop
        // List<Vector3> temp = inputPoints.ToList();
        // temp.Add(temp[0]);
        List<float> listArea = new List<float>();

        for (int i = 1; i < inputPoints.Count; i++)
        {
            float x1 = inputPoints[i - 1].x;
            float z1 = inputPoints[i - 1].z;
            float x2 = inputPoints[i].x;
            float z2 = inputPoints[i].z;
            listArea.Add(CalculateAreaInSquareMeters(x1, x2, z1, z2));
        }

        float totalArea = 0;

        foreach (float area in listArea)
        {
            totalArea += area;
        }

        float metersSqr = Mathf.Abs(totalArea);
        float feetSqr = metersSqr * 10.76391042f;




        return feetSqr;

    }
    public static float CalculateAreaInSquareMeters(float x1, float x2, float y1, float y2) { return (y1 * x2 - x1 * y2) / 2; }



}
