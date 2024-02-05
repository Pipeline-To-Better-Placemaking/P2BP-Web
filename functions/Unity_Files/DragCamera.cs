using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DragCamera : MonoBehaviour
{
    [SerializeField] private Camera cam;
    [SerializeField] private Vector3 target;
    // Transform center = new Vector3(0,0,0);
    [SerializeField] private float distanceToTarget = 10;
    private float tracker;
    private bool isPanning;

    public float distance = 10.0f;
    public float height = 5.0f;
    public float rotationDamping = 3.0f;
    public float heightDamping = 2.0f;


    private Vector3 previousPosition;

    public GameObject invisiblePrefab;
    // GameObject target;
    public Vector3 spawnPosition;

    private void Update()
    {
        target = GameObject.FindGameObjectsWithTag("Model")[0].GetComponent<MeshRenderer>().bounds.center;
        // spawnPosition = GameObject.FindGameObjectsWithTag("Model")[0].GetComponent<MeshRenderer>().bounds.center;

        // if (target == null) { target = Instantiate(invisiblePrefab, spawnPosition, Quaternion.identity, GameObject.FindGameObjectsWithTag("Model")[0].transform); }


        // Always look at the target

        // cam.transform.LookAt(target.transform);

        if (Input.GetMouseButtonDown(0))
        {
            previousPosition = cam.ScreenToViewportPoint(Input.mousePosition);
        }
        else if (Input.GetMouseButton(0) || Input.mouseScrollDelta.y != 0)
        {

            Vector3 newPosition = cam.ScreenToViewportPoint(Input.mousePosition);
            Vector3 direction = previousPosition - newPosition;

            float rotationAroundYAxis = -direction.x * 180; // camera moves horizontally
            float rotationAroundXAxis = direction.y * 180; // camera moves vertically

            cam.transform.position = target;

            cam.transform.Rotate(new Vector3(1, 0, 0), rotationAroundXAxis);
            cam.transform.Rotate(new Vector3(0, 1, 0), rotationAroundYAxis, Space.World);

            if (distanceToTarget - Input.mouseScrollDelta.y != 0) distanceToTarget -= Input.mouseScrollDelta.y;

            // Debug.Log(Input.mouseScrollDelta);
            cam.transform.Translate(new Vector3(0, 0, -distanceToTarget));
            previousPosition = newPosition;

        }

        // if (Input.GetMouseButtonDown(1))
        // {
        //     isPanning = true;
        //     previousPosition = Input.mousePosition;

        // }
        // else if (Input.GetKeyUp(KeyCode.Mouse1))
        // {
        //     isPanning = false;
        // }

        // if (isPanning)
        // {
        //     Vector3 deltaMouse = Input.mousePosition - previousPosition;
        //     float deltaY = deltaMouse.y * 45f * Time.deltaTime;
        //     float deltaX = deltaMouse.x * 45f * Time.deltaTime;
        //     // new Vector3(difference.x * 0.05f, 0, difference.y * 0.05f);
        //     // target.Translate(new Vector3(deltaX, deltaY, 0f));
        //     previousPosition = Input.mousePosition;
        // }




    }
}

