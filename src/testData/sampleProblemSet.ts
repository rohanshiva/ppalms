import { ProblemSet } from 'interface';

const sampleProblemSet = {
  name: 'Javascript Basics',
  generatedAt: '2022-11-27T04:40:12.367Z',
  problemTypes: [0],
  problems: [
    {
      id: 'reorder-0',
      type: 0,
      data: {
        question: [
          '    center: uofm,\r',
          '    zoom: 14,\r',
          '  });\r',
          'let geocoder;\r',
          'let DirectionsRenderer;\r',
          'let uofm;\r',
          '  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r',
          'let map;\r',
          'let directionsService;\r',
          '  map = new google.maps.Map(document.getElementById("map"), {\r',
        ],
        answer:
          'let map;\r\nlet geocoder;\r\nlet uofm;\r\nlet directionsService;\r\nlet DirectionsRenderer;\r\n  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r\n  map = new google.maps.Map(document.getElementById("map"), {\r\n    center: uofm,\r\n    zoom: 14,\r\n  });\r',
      },
    },
    {
      id: 'reorder-1',
      type: 0,
      data: {
        question: [
          '  map = new google.maps.Map(document.getElementById("map"), {\r',
          'let map;\r',
          '    zoom: 14,\r',
          '  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r',
          'let geocoder;\r',
          'let DirectionsRenderer;\r',
          '  });\r',
          'let uofm;\r',
          '    center: uofm,\r',
          'let directionsService;\r',
        ],
        answer:
          'let map;\r\nlet geocoder;\r\nlet uofm;\r\nlet directionsService;\r\nlet DirectionsRenderer;\r\n  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r\n  map = new google.maps.Map(document.getElementById("map"), {\r\n    center: uofm,\r\n    zoom: 14,\r\n  });\r',
      },
    },
    {
      id: 'reorder-2',
      type: 0,
      data: {
        question: [
          'let directionsService;\r',
          '  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r',
          'let DirectionsRenderer;\r',
          '  map = new google.maps.Map(document.getElementById("map"), {\r',
          '    center: uofm,\r',
          '    zoom: 14,\r',
          'let geocoder;\r',
          '  });\r',
          'let uofm;\r',
          'let map;\r',
        ],
        answer:
          'let map;\r\nlet geocoder;\r\nlet uofm;\r\nlet directionsService;\r\nlet DirectionsRenderer;\r\n  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r\n  map = new google.maps.Map(document.getElementById("map"), {\r\n    center: uofm,\r\n    zoom: 14,\r\n  });\r',
      },
    },
    {
      id: 'reorder-3',
      type: 0,
      data: {
        question: [
          '  map = new google.maps.Map(document.getElementById("map"), {\r',
          '    center: uofm,\r',
          'let uofm;\r',
          'let geocoder;\r',
          '    zoom: 14,\r',
          'let DirectionsRenderer;\r',
          'let map;\r',
          'let directionsService;\r',
          '  });\r',
          '  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r',
        ],
        answer:
          'let map;\r\nlet geocoder;\r\nlet uofm;\r\nlet directionsService;\r\nlet DirectionsRenderer;\r\n  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r\n  map = new google.maps.Map(document.getElementById("map"), {\r\n    center: uofm,\r\n    zoom: 14,\r\n  });\r',
      },
    },
    {
      id: 'reorder-4',
      type: 0,
      data: {
        question: [
          'let geocoder;\r',
          'let uofm;\r',
          'let directionsService;\r',
          '    zoom: 14,\r',
          '    center: uofm,\r',
          '  map = new google.maps.Map(document.getElementById("map"), {\r',
          'let map;\r',
          '  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r',
          '  });\r',
          'let DirectionsRenderer;\r',
        ],
        answer:
          'let map;\r\nlet geocoder;\r\nlet uofm;\r\nlet directionsService;\r\nlet DirectionsRenderer;\r\n  uofm = new google.maps.LatLng(44.9727, -93.23540000000003);\r\n  map = new google.maps.Map(document.getElementById("map"), {\r\n    center: uofm,\r\n    zoom: 14,\r\n  });\r',
      },
    },
  ],
};

export default sampleProblemSet as ProblemSet;
