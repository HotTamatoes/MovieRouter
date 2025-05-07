package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type Theater struct {
	Name        string      `json:"name"`
	Address     string      `json:"vicinity"`
	Rating      json.Number `json:"rating"`
	RatingCount json.Number `json:"user_ratings_total"`
	Geometry    Geometry    `json:"geometry"`
}

type Geometry struct {
	Location Location `json:"location"`
}
type Location struct {
	Lat json.Number `json:"lat"`
	Lon json.Number `json:"lng"`
}

var input = []byte(`{
   "html_attributions" : [],
   "results" :
   [
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.8892021,
               "lng" : -105.0706706
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.8908570802915,
                  "lng" : -105.0689413197085
               },
               "southwest" :
               {
                  "lat" : 39.8881591197085,
                  "lng" : -105.0716392802915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "AMC Westminster Promenade 24",
         "photos" :
         [
            {
               "height" : 3000,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/118147238521074309357\"\u003eRick Ellsmore\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcL62A8Dbyak6zPOg4H645eT4hWwDkTsozJN5I8WSF2Ti_L1CXrl234SRcI8IohLL1QNRb2iro7RcNhiJtLxIqa6-Nn9nzKS7t5FbMmWZdQg3gbawV8DLJLp2Luoxr-frS7ZC-ZNB380moG4NUbC7YAem5Vit1GzQSsdm_m-ZYDLkHaUfjfOBnhepTZA0zUvpoR8y_ChQjO8egE45Q5oLPR_Tq-R6djNE5lzdsC9zoeD7Y80Nj3bXZeJy74CL87uFdiZyPOniABMuBwe_7p2AdC4xvStFHESApggxvXZh6ZDzdp3s4IO1M4Zgl5xXpiMS2z8JdvqkbMpnbS4KU25ZepVfHX45T4xUX0BBPp1F8RCF6W3UqQzonGKjSfkOenbyp8NHUuVbNrhJ4Ttlv3eB6DWAf74-kAx0LPBWh8Pet7ywm4y_fXPmHajnP1T2xf97GP2nxdsnnHDAD51La5dUdajTsQSm90ganWr3qpGITsO51UoEr9p99_7mVW5E1JB1VgbZE5sCwen_f6HMv7Nkd3SngLqHabhzi48PDcwH5Oos9pvlz9KuYt5vjlBw1DIq9aDftk3ZQG_VihhMooHYYUOr334a4KKUgx_Cd6g0lvJItjLTF4tfQCL3nz-UjPe",
               "width" : 4000
            }
         ],
         "place_id" : "ChIJL-I-kSmKa4cRhMF8jotb984",
         "plus_code" :
         {
            "compound_code" : "VWQH+MP Westminster, CO, USA",
            "global_code" : "85FPVWQH+MP"
         },
         "rating" : 4.2,
         "reference" : "ChIJL-I-kSmKa4cRhMF8jotb984",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 5393,
         "vicinity" : "10655 Westminster Boulevard, Westminster"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 40.0192877,
               "lng" : -105.2611921
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 40.02064208029149,
                  "lng" : -105.2595093697085
               },
               "southwest" :
               {
                  "lat" : 40.0179441197085,
                  "lng" : -105.2622073302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
         "icon_background_color" : "#7B9EB0",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
         "name" : "Dairy Arts Center",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 1440,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/103635588076642629376\"\u003eSteve Karcher\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcKrQA7b1JTRE9obb6L7D0lrYirhH8bP29wl1iuW2T_NmXYbZ0aHwua-QVar1ACcSve9ImglnOzapE5oc1GvwhvZm-S2_Xe8K_do8nrKsEwgEUPhXQEAbWdoTsw-VSO03jXugVRNrjQwI4jRJXZQ-q9s90tysjSp282THRnyIdF9XGG47Ivdi2Fr1uKvVTT4NBz_6ayUIJLjeOOW-YrMPhkfLNcAai1qVHuKRLKRpbngoJr4xnbnEb3n_gLnQXa7CB9TDtEQG8cx0qPkuG0piAM9Am_pBGNWxFkLRYzR1hM2kaZVpHTM4QTP5dEOwxC_CLKVkCa6PJixvPHq9B3w1oE8pv7ghAt1jcThIHt7oWMH-4J1EK40EGh_OrsTaWlxaVzgDOsrWWXBannt-I7BzY4c0z770ObMA5lNfDsT2LPMwWWJNuEMqkn4K6Kc56ZUZsCGHPLA1zwkf_jy2iDiVP6t71gNTmEJEoadZwkqEf2PKKmaR68idOTa9tp_A5cKqWpt0oLe-XtazCugozEgHBHj5CzwCFDw_jKnxRP41ZGK8BNJ8fMKDWSK4aSzYvUK6qVYyepfjAYdVMqOHF1Gy4-KjR-YjbwgcgV9YLq-XH6kvy1QU83ky_FsAHX-w-bTGx8e4R5g",
               "width" : 2560
            }
         ],
         "place_id" : "ChIJdy5uF9Tta4cR4gHAaS5a6N4",
         "plus_code" :
         {
            "compound_code" : "2P9Q+PG Boulder, CO, USA",
            "global_code" : "85GP2P9Q+PG"
         },
         "rating" : 4.8,
         "reference" : "ChIJdy5uF9Tta4cR4gHAaS5a6N4",
         "scope" : "GOOGLE",
         "types" :
         [
            "art_gallery",
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 110,
         "vicinity" : "2590 Walnut Street, Boulder"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.93015310000001,
               "lng" : -105.135388
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.93172473029151,
                  "lng" : -105.1341643697085
               },
               "southwest" :
               {
                  "lat" : 39.92902676970851,
                  "lng" : -105.1368623302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "AMC Flatiron Crossing 14",
         "photos" :
         [
            {
               "height" : 3024,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/114439592776836433068\"\u003eJoseph Martinez\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcJRwdQ7QEtbhIiYq98Mt2oqhRlDT8aipqBirZVysYeHvB-CSfhxhPNntdAaeqbXF7DO20KEx-4xSCQzbZUM2wrxa-atkTU1dqE6nYPt9lOvh4N6oc5_dHdPyEDpHMGPpH0-7L7y2CAVZGJ_AG1dElkR--Z0s1D7Zbrm6hoFHnUYW1fG-2r5MMnwvYsWwEyeUJv6b-pxq4iFyO-OciaHLa4zsRwP6VUVgEGS1hUY77-U66AZdbfIYV_XTKdlBBca0F_PGCcRjiPg2Ce-MKGQ-ZremnRqIPuXrTF-Xwwx-KomVPLP1L0aBQX_FSXHKqLtlPVbj0OKTUEK7_TqB1AGdZJ-vGrEY0jZrkEG40MkXMRommlpyq1QKNz_ZWd9gnB68jkYMSKQMDibDXw6l-9noYiJLBejg0UZmkjotMGQZvAeNtM9TfJcKovMw5E8DtGiqSPt-0ygg7a8h00CbyaRkhXr8Owra9sNcjVLaxSUejZnInVU00Qrn9zbltQXvo_LQ_d8ZdxmMT-nu-Wl_2LurMC8RYQRcRQ4BDU3sWOUcgpMPzzKWXGpDUIip4p8nNs-oKmmwWW2o9Sv457rrjqebyFaQzVv11c3EkvZ-_Mk9lPPNA8-ysEK5PShRanDp27-ExmUaQ",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJr5ezToOMa4cRNLaO3aui2lo",
         "plus_code" :
         {
            "compound_code" : "WVJ7+3R Broomfield, CO, USA",
            "global_code" : "85FPWVJ7+3R"
         },
         "rating" : 4.4,
         "reference" : "ChIJr5ezToOMa4cRNLaO3aui2lo",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 2067,
         "vicinity" : "61 West Flatiron Crossing Drive, Broomfield"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.9622352,
               "lng" : -104.9942947
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.9635708302915,
                  "lng" : -104.9926125697085
               },
               "southwest" :
               {
                  "lat" : 39.9608728697085,
                  "lng" : -104.9953105302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "AMC Orchard 12",
         "photos" :
         [
            {
               "height" : 3000,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/102677017368825401864\"\u003eJames Dressler\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcK6m4y2rVX2eDTqfP0E68xxraeW3KWS1OwzUYmuj8AIb9h8TNRbKWavy9HRdpr443fBoU4-D18ChzaiN51EMOoYuTtut3gSoAvWeNdgouLfLZMTmeA92ZrFpU8nlZvoeCGN1j6lt5QAAjEpTqHcWWWo-VxdUpcNqDZSabyr24eDQsDm0UQ5WbjvDhfxYRkWMNz025G_CSrzi0ByDlpVxn8sz1jkuTVMAy64EU0y1JgS_NSJnEtJK2JsxWnRZTaY2ju-uXUtDmNohqhNNzOSN7QyksRYroF9YVrMGMR1KKb_cf2I9K29WL-2mObm16VcSAevrbCcOA3cPJfRVtWN2A32hlWhivETvB6_wpZeCAMBCkne5nKk1TFcrNCDNwi6alLJJQiAmxQN-9iVzbpkwUVynSEJmv9AvrJVmVs9x5RzXlru0TeHLAWDh8RXOH3y7NLVBzrgjEv5lMED1OPjsUoI1gO-VMIUM4ktaa0JLdnc2QV65Ie6uK3J-MF089VNRqKngWS2e1GKDauu52f8M6DFjaA8K46-v7z1PbqpjBl9bva7jPGp89Lg6oKO7XHDcsd2Gz2KQSAYW0oP010vS7ENnEgQzXtGCITl8An2NDoH0-miuRLhIgucMpNQ-hFSrHQvHw",
               "width" : 4000
            }
         ],
         "place_id" : "ChIJ6y6AriN1bIcRgj1qp3CwZfA",
         "plus_code" :
         {
            "compound_code" : "X264+V7 Westminster, CO, USA",
            "global_code" : "85FQX264+V7"
         },
         "rating" : 3.9,
         "reference" : "ChIJ6y6AriN1bIcRgj1qp3CwZfA",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 2300,
         "vicinity" : "14653 Orchard Parkway, Westminster"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.73220999999999,
               "lng" : -105.15566
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.7335615302915,
                  "lng" : -105.1543791697085
               },
               "southwest" :
               {
                  "lat" : 39.7308635697085,
                  "lng" : -105.1570771302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Regal UA Colorado Mills",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 2988,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/101171897700059699797\"\u003eKyrie Tombaugh (ChaoticAngyl)\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcJCmx3a6KfPs7thJrfxba4kd4YtRizDxJSbM_ZUSOKZrlTQqShA_KiEzN8dSJ70b1ZriWWtq26AZHtfd9K3ijA8LMGk3ClsUvT-UbooTV7j0TBBQnwD5EiK55wI9usMg5dbRn87fOJuXZaZIWLH7i8WTw6fMEsfuZKxStHQJdkZI5aKPiGf9908Y9APSBa2mCw272aahfkZhHIH6Mzoj4tae0aNWs4YRlEPjDu2Qi4xEkcX5CoRI0AM3_N6WbQHU3YkI0sOdQ-8Z2WJIDfDcbXaCjc_OmXRsRN8GA2vYvfV1dgKoVQxAVseuzf9g4q-Un6_lEZbB33fYp3w4Xw8Xb-qNtyn9aOCMKqOwevxp2Y5PzPss9zpT14jqGh2X2KeGX82TiMIWPPprIOsN2EHLRrIdqs8nnkl2b5yBYNUhGWYv6b87X2WIOtKRVK8q9WL_LvbJyKjAO8l-2lmc7KQgOcA2swvPK3BHaLygawrtL88W1uw_EYd-HUekFiLwvuVSc-qYHFPRCjQbUDvvATtUjr-39KrI-CKL8-Vr9H52kYvZayC9wcPq11eZWpzsWOm7izCr6KynEI21GzBYWQGyUSuKuSFVj83tVKy4r5s06TuFBgSlRJjr5-_n23Pk43tVbZHZXO7",
               "width" : 5312
            }
         ],
         "place_id" : "ChIJHbPlPWiEa4cRf4S28Oz167E",
         "plus_code" :
         {
            "compound_code" : "PRJV+VP Lakewood, CO, USA",
            "global_code" : "85FPPRJV+VP"
         },
         "rating" : 4,
         "reference" : "ChIJHbPlPWiEa4cRf4S28Oz167E",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 1696,
         "vicinity" : "14500 West Colfax Avenue Suite 600, Lakewood"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.8140006,
               "lng" : -105.0511428
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.81521053029149,
                  "lng" : -105.0499688697085
               },
               "southwest" :
               {
                  "lat" : 39.8125125697085,
                  "lng" : -105.0526668302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Sonora Cinemas of Arvada",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 2988,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/114706947245884810357\"\u003eFrancisco Muñoz Meza\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcIs5FYBPqJS6i9JSMHwarh6u13Fph8lH1GKIhE-bpH5_oRdDwo0LyFm0iXZ739x1TvwvzEvVmUeb6BtTuES_M_qW4MoLWO-3MnvbipPuFLe0UJM4uwQdVJ_3HeSQC4tOVch3P_A1TKLVOvMODxli9j7RojYCTreUJLD4fjYN4U3fgBx_JbmkcpG_LOb_3-Tqb0wU4Qi1Ky2aGwOekXZ-AhZaS8knZBOh2_IXJpgH97CGHyAqNik12dqbiJzM7KTUD66CCclXUfZsxBIxSOnnVB7UdjiZW6uOuvt1Y6rusbTl0qUzBQyIl07YOoOPKuhIpShBi8ftYoYguWWvFvJHUrzAVO-d9WgRj3IZmpjuzUC5752S2njzVqh6PaBw3RhBLetIDp3bY5QdjweUcwOJWM-3OyUbVrJFDZEn-iwetdycF0JaRm4VWZ9FqYn3TLRhuXTg0ZZqJCjmRvS2XH-Kc0J_I-n3gxXmahC4g7k8G32HU8MET-lAr-FuBZ1ZIA6SMJ-BSD1ZxVljCFgiY7S8J5Z5GQAnoKw3eigIVjP9to6HQsdk1eSItpE2oNqfcvN-7q80i9WbQc87D6zdZCaFOJi8_NXyYv-UtNYWerm6on6Stb4v4peZ8XqGQ8sIoSwlKwcAe9c",
               "width" : 5312
            }
         ],
         "place_id" : "ChIJQWCEvM18bIcRF4Yfk4_T4jQ",
         "plus_code" :
         {
            "compound_code" : "RW7X+JG Arvada, CO, USA",
            "global_code" : "85FPRW7X+JG"
         },
         "rating" : 4.2,
         "reference" : "ChIJQWCEvM18bIcRF4Yfk4_T4jQ",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 757,
         "vicinity" : "5157 West 64th Avenue, Arvada"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 40.0035992,
               "lng" : -105.2634436
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 40.00479893029149,
                  "lng" : -105.2622731197085
               },
               "southwest" :
               {
                  "lat" : 40.0021009697085,
                  "lng" : -105.2649710802915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/school-71.png",
         "icon_background_color" : "#7B9EB0",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/school_pinlet",
         "name" : "Fiske Planetarium",
         "opening_hours" :
         {
            "open_now" : false
         },
         "photos" :
         [
            {
               "height" : 2824,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/102479702800170605259\"\u003eFiske Planetarium\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcLDcHqLBOTJSkDxDj5EtbW7HW9LpIjGdkTWS6W1KedoGpoHD30jrD1htTJzHIs2KaKlihlIaBMghFLEmEcJTCQcGub4I0L-ELuP9GWYZc1Pmgl8LM4h68iSfH-SyVu5UHZ8bxc8LgTWoQc6_Dl4uek1pkV2oaqQvmLp1PDJ76Jp6eIX5uf0j0AcqeFcQX53wE0m_aq4Tc9XVQGybocIEx2P6egyEph3AZe4y-QKWQ6aH0oMIE4-vV9tn8kkVgFLzJEkgygueKJOy8z33F4SRNQI3wlzG4VecmiuITGTFIyRlhHsRlO01qal7MOHV4DR7qcwWXvBgqg",
               "width" : 3878
            }
         ],
         "place_id" : "ChIJOzT2QTXsa4cRYKro75cPNtM",
         "plus_code" :
         {
            "compound_code" : "2P3P+CJ Boulder, CO, USA",
            "global_code" : "85GP2P3P+CJ"
         },
         "rating" : 4.6,
         "reference" : "ChIJOzT2QTXsa4cRYKro75cPNtM",
         "scope" : "GOOGLE",
         "types" :
         [
            "tourist_attraction",
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 226,
         "vicinity" : "2414 Regent Drive, Boulder"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 40.0172873,
               "lng" : -105.2542332
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 40.0183654302915,
                  "lng" : -105.2533729
               },
               "southwest" :
               {
                  "lat" : 40.0156674697085,
                  "lng" : -105.2568141
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Cinemark Century Boulder",
         "photos" :
         [
            {
               "height" : 3024,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/105090932168990832875\"\u003eMark Limber\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcKAbDoIouqYiMspuo1vqKqlwR3lgDu8lScPBnLa2n6Egvj8N2Z4zpYXulN9NMYLS6vsFtv0vG_NK9mvr4jbPciNzGqDfVYx_KLFq-j4k0tahszmoS7YWK-m5kGB1f9ex-XaMy9yhM-zIvOm6IX2MXMF5MCUVfCoUPdXRJTWcnZVJQH2vDFeAMfi0mmQuq_iuH_6QPDG51_KyxWhG0sn0xKTfx2WTKIMlKTZKUGW_7NwIhMD0KiDN6UIdE2ixp5qFfyQczF9sEffcdpWpg9Mf0kvQ0bvazwsXat7sDWKpAwnXGHtfj8Ra4RprRC86qRKKgjCc5hZFUpjgRks1UxgVwuHe5C2fRmazbFqzQnIJCS7A7RVU6Hcb0KCv_NVxObkr7GMbfj1QJWnQy_8U7-vNCnQEwtmq141Zz7Ko9Y_hnc4m073lun6YSa6tNNWoqa2cVp8neWcLnSjYuj1JrWWQ1-UQ8ZVFNpOuOA1N_0Akk2mfJcg9dd4GCqKNRCtnfozcVv5W_Uwxz_cmjRnJtklmO4ONlyTaKghd3w9Yqef7zj0rl9QiSvAgFUp9B_ljFfnmnmTBkUKv-A6-Y1mKyzGq494s6dZBAV9-16L7jmJVLIK3tohIefstTpNJ_ptZDaNDY_lDnGn",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJ4_7xgtDta4cRIUoVr4s8aqo",
         "plus_code" :
         {
            "compound_code" : "2P8W+W8 Boulder, CO, USA",
            "global_code" : "85GP2P8W+W8"
         },
         "rating" : 4,
         "reference" : "ChIJ4_7xgtDta4cRIUoVr4s8aqo",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "meal_takeaway",
            "restaurant",
            "food",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 1080,
         "vicinity" : "1700 29th Street, Boulder"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.85480460000001,
               "lng" : -104.8988685
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.8559975302915,
                  "lng" : -104.8977899697085
               },
               "southwest" :
               {
                  "lat" : 39.8532995697085,
                  "lng" : -104.9004879302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "The 88 Drive-In Theatre",
         "opening_hours" :
         {
            "open_now" : false
         },
         "photos" :
         [
            {
               "height" : 3024,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/116393206520833576750\"\u003ejessica montoya\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcIoS5e0UeL5XLM_9fWwZUrdlcQ25kwJ6DyLtvVLBm_lBh2Zajb1vqmvs_zR8BnwLtXjIph8H_xm_-wDgPIBk-t5Q5jkSXyhyCmiLGJu31qnlddVQ8OCeVkS3to2hUDRmw-bNon2RIIj6wOtF_BNs40QsEaasWQgKK3V4tljMHI1fAdAT9M-zlrneBik4lMdNLrQHsuUKGYjgcUlJP4VrWC-is6v0RRw6SkS1TK8NIMDnwhtsuDMQEW9e1PR8es56OUHvsvAjNP1hpmI-xLK01f_I5nV8cAmz17CSYY9FBgyIFqik7AL9DnaehOd4OO8uIZoAhiS57tq2eV_tljteMC5Mfd2QkPoDY7JStosh-Qy84T5ETn6GuvqpPZhdRDF8tj4fuau-Gw-Y7Qio88kxRa_W9u5zLK8x4zi3x8i8qkOTaxrGEUPoMUcgrUuCB8ZCJtU5rABl58DbUJf1Gqib_hqCH29D5TjSC6Wj7C-_ck0TWS2PEcfJfKfqMrKNNCbzkLqnem5MRJVCtTCYdxTFdRZp30IqzFeEH8AXBN4nZTjIRiKJeta2Q56LLd5jhNSUDquDUoOa2bAvufQhEHz6f51SAnFXYjIBsJd3wcLv6k3hd4xYExAYKSaoaeS8XEWT3voMw",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJcXel_PNwbIcRQVnV-ZNyKE4",
         "plus_code" :
         {
            "compound_code" : "V432+WF Henderson, Brighton, CO, USA",
            "global_code" : "85FQV432+WF"
         },
         "rating" : 4.1,
         "reference" : "ChIJcXel_PNwbIcRQVnV-ZNyKE4",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 2495,
         "vicinity" : "8780 Rosemary Street, Henderson"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 40.014866,
               "lng" : -105.2822278
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 40.01634438029149,
                  "lng" : -105.2807327697085
               },
               "southwest" :
               {
                  "lat" : 40.01364641970849,
                  "lng" : -105.2834307302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
         "icon_background_color" : "#7B9EB0",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
         "name" : "Canyon Theater and Gallery",
         "photos" :
         [
            {
               "height" : 3024,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/109753720827670106653\"\u003eConnie O&#39;Dell\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcLmtGIOruWpBM1VtBnJrElnfIyYe_Gk43CB2cvtUauwQ4K6L5D4YB7-q4vDtLECiC5maV41LxUuciLETKkWEqKoqEUJYVm1_UiP8wGfLcHKoEhD5qVIPZuZa_Eo1PGcsM3_ey3DseDZ4_W2k8SkUyByYC5bX9__1BLZER9WMKOdROyd7kTbpOMo6mR1n-tbMO9wVL4rplUy8V5HbOdubqSrIWTJ8V2Ga0kcLQbJSKvXnTzoSLkjoz6HRG3_9pVPrqeLfBVOrZYN6o5DxyMCEUJqQqseYZRYENhTTyn8225L6Drt2uCHC5sVodG3BruwQYrZYb9wyZDXaHI3sbqMi4S2ZgNuhO4yxsFazcA4RFLtlC5KH3-Wm1VdfjOuzGBAQZ9PtMfcEjYr5GyKyxgZ_5wla6fdFJDoXe_l-DCRSLDQU_-SLStAnQNHgtY6-jTr-SeFuccxIoTvdpGNCoFvfmQ1QxCtitsd0sCA5qLHhZ-DmyWpvazHsRacX-1I6YGkuWNV7J-UYjOj05k3K9KrU9a9rLfSwAQ94kkEi_PsFnK2s9lrGQcw5CkN1kTjR6gRXNoTbhteBk493Gn_Rcl_g-2oVr_jhJBUV5QrjtW9LfiQgCpnuOA7mMZaIU7EsevSfOSD2w",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJK34DPSTsa4cR52Kv304FKcg",
         "plus_code" :
         {
            "compound_code" : "2P79+W4 Boulder, CO, USA",
            "global_code" : "85GP2P79+W4"
         },
         "rating" : 3.8,
         "reference" : "ChIJK34DPSTsa4cR52Kv304FKcg",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "library",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 4,
         "vicinity" : "9th Street and Canyon Boulevard, Canyon Boulevard, Boulder"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 40.147655,
               "lng" : -105.12714
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 40.1490146302915,
                  "lng" : -105.1260048197085
               },
               "southwest" :
               {
                  "lat" : 40.1463166697085,
                  "lng" : -105.1287027802915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Regal Village At The Peaks",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 4032,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/112314301811711476017\"\u003eScott Wendelberger\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcIsvll5r33r8nCJVMxuv5qes6OzR-XmfiYetCZvER7QCwgy8Bfh0KGx3LeRUnVwnz9KDOkiajZsQfW0OVPn-nkVJbrltjV2RkQc6CtFJkvLTlHLSctKpBI5dDTswX-_J3i6GoXsY6bxObPkEnVzlvvr_LkmOwAD83LacVtfY-qGqUgeueV-l3A6aHX6KWuRYRVZIMMvF_YT_ZlRoxWMWMGN8K8r4TVtXDUJ-8Q5l51aekLQJQS-sHFsk4M20rqul-SE7M1RSobXyA_8OPD4JwTd1Xe0fgf4RGDqRxNX8_k0OQy3MusuKeEPGz6sXATwYb2Mb5FKuhps3KCPwHXQ9RjpyRCq8unRlUV8-liu0RjLhWfPD2ZG4it-DOReUyqJ0OIWnIzJG-PafgRqY_iXC3AjGr_NMKXCwssnB-JPz2S6UlruPSfb-bXs7fPXpf_AEw5AGetPA-V1RhH5vqkVDI7uHYO665hnDdrdjEmy8DaOjVxqwa0CWogmqeOa4yc84AhVDo4cCYBBFdm716HUsXLy8FVP15B17YygFMzGVWb6xI_2OdtR_43Iufw0Zaihd_0RT7hj7K9y8gAKNEMNKedt5mWmYHzYMv0wgcKH5iEFK2XLyLgYOX1_VXeGFa1DEr5NSg",
               "width" : 3024
            }
         ],
         "place_id" : "ChIJu2RvbiH6a4cRpGERBg943_U",
         "plus_code" :
         {
            "compound_code" : "4VXF+34 Longmont, CO, USA",
            "global_code" : "85GP4VXF+34"
         },
         "rating" : 4.3,
         "reference" : "ChIJu2RvbiH6a4cRpGERBg943_U",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 1888,
         "vicinity" : "1230 South Hover Street, Longmont"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 40.0476769,
               "lng" : -105.2798548
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 40.0490054802915,
                  "lng" : -105.2786072697085
               },
               "southwest" :
               {
                  "lat" : 40.0463075197085,
                  "lng" : -105.2813052302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
         "name" : "The Nomad Playhouse",
         "photos" :
         [
            {
               "height" : 2988,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/101765889613512821352\"\u003eElla Hansen\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcLAlRT71BEvWgX776bVOgLKjVB20MkW8iMa6JvYOfusqpycgkG8xWQthooSv9iTxzzUT05w1ZcSALNNUbz8a90FAPvTwGZmC-XBHGSpMdEaCS3wKfXWmSkE-FC8P4S-PTin3n-gm8RFjyC5lfXIEPHIT-w_5l2VacjHaWav6Gn4SawEydvnffj2rmbVjcPGNNqeqAMKcj5jJxHjuQu-AQBUPr4f4wqvCDlwMPCcLoxLbK0A5tLpD98guGmpoeznUpXgPukqMd8ZGahxD68da_tdTm9IIyaGFVQVfDwX7tYbCykcIEjyOa_VSQD-aSHPkH52ybSBNuPOlJ0lp66tcH7X9xEXfU4lg-BvfFnBuNUMejVsKsVCM5k4Ac8sjEncU6DmYndhbEodyIrQGRqE4Dsypec1w_IhXAIKrvmAMr1RL_pHfTeIwb6_D1wZJYiEoo3g9fyAA8AiYB2-xIPDlKmQ_xoFe0WWkMn65Lh8WOKReX1366Yhmcx5QZdZu6GkcqIicQneDep2Xv22EuIUHwo0Y22Hl4iKXjarMSffnmjIDz6bvUhG8-6yxFbMsKgU-SjTtx2B0j6usE37X3vUvs9qGu5YAAJeCvsmw4h1WncQrMe3zwAwmleaBIbw3eWjhCPj9w",
               "width" : 5312
            }
         ],
         "place_id" : "ChIJh9IURO7ua4cRpgwBqCQNUxM",
         "plus_code" :
         {
            "compound_code" : "2PXC+33 Boulder, CO, USA",
            "global_code" : "85GP2PXC+33"
         },
         "rating" : 4.7,
         "reference" : "ChIJh9IURO7ua4cRpgwBqCQNUxM",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 67,
         "vicinity" : "1410 Quince Avenue, Boulder"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.92994389999999,
               "lng" : -105.1352719
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.9315967302915,
                  "lng" : -105.1339977197085
               },
               "southwest" :
               {
                  "lat" : 39.9288987697085,
                  "lng" : -105.1366956802915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Imax",
         "place_id" : "ChIJhyIlLYWMa4cR9iKUvISImIw",
         "plus_code" :
         {
            "compound_code" : "WVH7+XV Broomfield, CO, USA",
            "global_code" : "85FPWVH7+XV"
         },
         "rating" : 3.8,
         "reference" : "ChIJhyIlLYWMa4cR9iKUvISImIw",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 9,
         "vicinity" : "Broomfield"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.85855739999999,
               "lng" : -105.0616457
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.8599248302915,
                  "lng" : -105.0602075697085
               },
               "southwest" :
               {
                  "lat" : 39.85722686970851,
                  "lng" : -105.0629055302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Alamo Drafthouse Cinema Westminster",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 3024,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/114872689995474707789\"\u003eAlamo Drafthouse Cinema Westminster\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcKRVFyt2GkA1LEOs33WF3vfNK7Qvvd_KjGtBPgNG6vj_aiRGtIUNrAL01yJ9aDBtP93yIMTjC-8rJzsxyYgGsFGmKMEf6tPE9jkirhlru-KBH83z-w59ZKYF0J9v2qElq7eu0ARct5hYV0TjvXo-97N1BanYWJyyYinBY-irUtOSshBGpw0U8SAHPvVKJrGgQqewYVq5nM_DLyXjImcKPSD_rHqh_yYDUXYMGUotNIT6Rba8M2IObRGlIH54T4gjLkxwigX-ZEPmNo5m-dMhzets6J-QbqU6EW756PooySZAl5qjTDPO9hdznWD_SL-AplkwkaU5Yo",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJB8tN6buJa4cRFVfBsY9uhME",
         "plus_code" :
         {
            "compound_code" : "VW5Q+C8 Westminster, CO, USA",
            "global_code" : "85FPVW5Q+C8"
         },
         "rating" : 4.6,
         "reference" : "ChIJB8tN6buJa4cRFVfBsY9uhME",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "bar",
            "restaurant",
            "food",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 3284,
         "vicinity" : "8905 Westminster Boulevard, Westminster"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 40.0184256,
               "lng" : -105.2768706
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 40.01984848029151,
                  "lng" : -105.2754642197085
               },
               "southwest" :
               {
                  "lat" : 40.01715051970851,
                  "lng" : -105.2781621802915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png",
         "icon_background_color" : "#4B96F3",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet",
         "name" : "Teton Gravity Research",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 3024,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/100635270695895876389\"\u003eTeton Gravity Research\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcIOFg8dINfkxz31BWlBuEYO0Fli-yXitocLz2N-adJKr6yxZESYJRHDM787bQ6NyipOIrWXa52DVO6-lXq6ClOezBLCnlgXnTefx64i3H8YojVLtLgmyESUthv0a7q1frQhqnHgD8JZv-5CVFeomwt1ywt-D7qIVdtwg3kvDgVfMTKI2xodJj4iuPZ-DeNQp7bhVCU_XnG58gfsc5SBNmw913HZ6aNdiPZ8U8be0BsDyywFd7hzFjqty37gycFv3Vsuvt8qUaAT8NZzWVaXWXNN2giazcotrk5NBGNmRrMxmcirbsc_p7GRIje1QTJ1p0EUOiojM7o",
               "width" : 4032
            }
         ],
         "place_id" : "ChIJMcgOQ_3ta4cR-rUG9GlOUMo",
         "plus_code" :
         {
            "compound_code" : "2P9F+97 Boulder, CO, USA",
            "global_code" : "85GP2P9F+97"
         },
         "rating" : 5,
         "reference" : "ChIJMcgOQ_3ta4cR-rUG9GlOUMo",
         "scope" : "GOOGLE",
         "types" :
         [
            "clothing_store",
            "movie_theater",
            "store",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 2,
         "vicinity" : "1420 Pearl Street, Boulder"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.7977626,
               "lng" : -105.080153
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.7989934802915,
                  "lng" : -105.0787562197085
               },
               "southwest" :
               {
                  "lat" : 39.7962955197085,
                  "lng" : -105.0814541802915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Harkins Theatres Arvada 14",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 3795,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/107077638583783844402\"\u003eHarkins Theatres Arvada 14\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcK__a0R4Q8BQ0GZ_qcCxcqKUKq6eTReCIXToCFOVK3O9VW3BTsm9gxDhnG6fqZyPQlzx4cwbCY00v0rnRQSEoeozXO7JDmX0sBJq1bkaNME9Rlbs0V8vvRHHUP_oOLXHT9Gloa7Z7mADKA-BSyIVcd8CPAJKdSYY0KAVLci_n1NNXe8-u4hE2LWXvtXkFgVaXm0Z6pIWAL3U5YHh-OnrDe3qwllLbYdbUq58Mf7x3rc6HtxfwdoZ_iMybwTw2acvt6-4N2dRn056sBh0-rGXp473uiPFNschAKTihZR3JGmt-jiVIq9tID_RkJNtZwa-qZs02ARlt8",
               "width" : 5693
            }
         ],
         "place_id" : "ChIJq6pqPi2Ga4cRPl8gTJx4nQs",
         "plus_code" :
         {
            "compound_code" : "QWX9+4W Arvada, CO, USA",
            "global_code" : "85FPQWX9+4W"
         },
         "rating" : 4.7,
         "reference" : "ChIJq6pqPi2Ga4cRPl8gTJx4nQs",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 3288,
         "vicinity" : "5550 Olde Wadsworth Boulevard, Arvada"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.7695205,
               "lng" : -104.9787221
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.77089563029151,
                  "lng" : -104.9773375697085
               },
               "southwest" :
               {
                  "lat" : 39.76819766970851,
                  "lng" : -104.9800355302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
         "icon_background_color" : "#7B9EB0",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
         "name" : "skytheory",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 1080,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/104419194596583412431\"\u003eskytheory\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcIB28QBp4XnMI_wyYNpOZWxIlUNXLlv5ypZcbRm4W8TQ2KRbEsG8Gj4YuXexpWrk7htOv2_t_1WB5KevVZsEdBRqmcToEcn1f1BZbb8a4sO1WlZCM6MS60iuZUCE0mKWB7WppVVe4eynCH_Lwhsxqe6lkmkeF_o_eZyLh3qv-LHTvAkcXZL9BW5KkDdNRN27R0Swo2hDUBUIWQ-CRfhVXJXV6z_GGRJl-g8LVvJiQ2BpPz7RYUHhIcNzD7jdAzAIHvhK5MLG9JKiAe6C4Uf4eqA6WrshGyRPzam-GoVAJ8Cg6MJ2AvXWk8ZDfNM9DFEKgfgJqnQ",
               "width" : 2560
            }
         ],
         "place_id" : "ChIJ7URHSxt5bIcRsf8jMf7COn4",
         "plus_code" :
         {
            "compound_code" : "Q29C+RG Denver, CO, USA",
            "global_code" : "85FQQ29C+RG"
         },
         "rating" : 5,
         "reference" : "ChIJ7URHSxt5bIcRsf8jMf7COn4",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 6,
         "vicinity" : "3435 Wynkoop Street, Denver"
      },
      {
         "business_status" : "OPERATIONAL",
         "geometry" :
         {
            "location" :
            {
               "lat" : 39.7408103,
               "lng" : -105.0425249
            },
            "viewport" :
            {
               "northeast" :
               {
                  "lat" : 39.74214673029149,
                  "lng" : -105.0410064697085
               },
               "southwest" :
               {
                  "lat" : 39.7394487697085,
                  "lng" : -105.0437044302915
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/movies-71.png",
         "icon_background_color" : "#13B5C7",
         "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/movie_pinlet",
         "name" : "Alamo Drafthouse Cinema Sloans Lake",
         "opening_hours" :
         {
            "open_now" : true
         },
         "photos" :
         [
            {
               "height" : 664,
               "html_attributions" :
               [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/104358368782689551605\"\u003eAlamo Drafthouse Cinema Sloans Lake\u003c/a\u003e"
               ],
               "photo_reference" : "AeeoHcLjYH2T5nQgms0H9-BFXpmwQ770KQnaQciie4YfbB6p4kdPQTNczny3m4ts46HvbA2XHBw_GB5yc4UByQqE6KnfEIwdD2LSULc8vBC1GjjlvjbNxwDeTc8F3cPGfpUehYt7sw9kWQDaD5VAGUkR9yASdglv6FSE-7RG1-3STeNmJg6vbYUBVnA7E7guR9I1BBZPcqH5TYIki5FQarKSYO9DYvc4-NBtj5WkCYAy0W-qhXtlvIyr3-RfyITWkD5CHjK1eax2doElvLFdaK6U9O1FzX_-R0hmRAdDqMz08XRfJBFE-E_kur0TaAjW8Of-4czZDi4LL48",
               "width" : 1000
            }
         ],
         "place_id" : "ChIJxwf2bVCHa4cRUvH-WNCnvkc",
         "plus_code" :
         {
            "compound_code" : "PXR4+8X Denver, CO, USA",
            "global_code" : "85FPPXR4+8X"
         },
         "rating" : 4.6,
         "reference" : "ChIJxwf2bVCHa4cRUvH-WNCnvkc",
         "scope" : "GOOGLE",
         "types" :
         [
            "movie_theater",
            "bar",
            "restaurant",
            "food",
            "point_of_interest",
            "establishment"
         ],
         "user_ratings_total" : 5622,
         "vicinity" : "4255 West Colfax Avenue, Denver"
      }
   ],
   "status" : "OK"
}`)

func getTheaterList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var theaters struct {
		Results []Theater `json:"results"`
	}
	fmt.Println("Starting movie info search with location: " + r.URL.Query().Get("location"))

	location := r.URL.Query().Get("location")
	if location == "" {
		http.Error(w, "Location not provided", http.StatusBadRequest)
		return
	}

	var url []string = []string{
		"https://maps.googleapis.com/maps/api/place/nearbysearch/json",
		"?key=" + API_KEY,
		"&location=" + location,
		"&radius=25000",
		"&type=movie_theater"}

	searchURL := strings.Join(url, "")

	fmt.Println("searchURL: ", searchURL)

	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		panic(err)
	}
	req.Header.Add("Accept-Charset", "utf-8")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	fmt.Println("Web has been requested")

	err2 := json.NewDecoder(resp.Body).Decode(&theaters)
	if err2 != nil {
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}
	/*
		err := json.Unmarshal(input, &theaters)
		if err != nil {
			panic(err)
		}
	*/
	json.NewEncoder(w).Encode(theaters)
}
