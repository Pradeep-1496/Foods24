import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import './BookingRestaurant.dart'; // Import Booking Restaurant Page

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Icon(Icons.home, color: Colors.orange),
            SizedBox(width: 5),
            Text(
              "Home",
              style:
                  TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
            ),
            Icon(Icons.keyboard_arrow_down, color: Colors.black),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.settings, color: Colors.black),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 15),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Bar
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Icon(Icons.search, color: Colors.grey),
                    SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: "Restaurant name",
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 48),

              // Image Carousel
              CarouselSlider(
                options: CarouselOptions(
                  height: 180,
                  autoPlay: true,
                  enableInfiniteScroll: true,
                  enlargeCenterPage: true,
                  viewportFraction: 0.85,
                ),
                items: [
                  restaurantCard("Pavilion Restaurant", "50% off",
                      "assets/img/pavilion.jpg"),
                  restaurantCard("Level 5", "30% off", "assets/img/level5.jpg"),
                  restaurantCard(
                      "Kshitij", "20% off", "assets/img/kshitij.jpeg"),
                ],
              ),

              SizedBox(height: 40),

              // New Arrivals Section
              sectionTitle("Today New Arrivable"),
              SizedBox(height: 10),
              SizedBox(
                height: 150,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    restaurantTile("Ganesh Aloopuri", "ganesh aloopuri, surat",
                        "assets/img/ganesh.jpeg"),
                    restaurantTile("Level 5", "Level 5 cafe, surat",
                        "assets/img/level5.jpg"),
                    restaurantTile("Chaat Hub", "Ambika Chaat, surat",
                        "assets/img/chaat.jpeg"),
                  ],
                ),
              ),
              SizedBox(height: 20),

              // Booking Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Booking Restaurant",
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => BookingRestaurantPage()),
                      );
                    },
                    child:
                        Text("See All", style: TextStyle(color: Colors.orange)),
                  ),
                ],
              ),
              SizedBox(height: 10),

              bookingTile("Kshitij Restaurant", "Open", "Close: 11:00 pm",
                  "assets/img/kshitij.jpeg"),
              SizedBox(height: 20),
              SizedBox(height: 10),

              bookingTile("Spice Villa", "Open", "Close: 11:00 pm",
                  "assets/img/spice.jpeg"),
              SizedBox(height: 20),
            ],
          ),
        ),
      ),

      // Bottom Navigation Bar
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.orange,
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: ""),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: ""),
          BottomNavigationBarItem(icon: Icon(Icons.location_on), label: ""),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: ""),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: ""),
        ],
      ),
    );
  }

  Widget restaurantCard(String name, String discount, String imagePath) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.asset(imagePath,
              width: 350, height: 180, fit: BoxFit.cover),
        ),
        Positioned(
          top: 10,
          right: 10,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.orange,
              borderRadius: BorderRadius.circular(5),
            ),
            child: Text(discount,
                style: TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ),
        Positioned(
          bottom: 10,
          left: 10,
          child: Text(
            name,
            style: TextStyle(
                color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }

  Widget restaurantTile(String name, String location, String imagePath) {
    return Container(
      width: 130,
      margin: EdgeInsets.only(right: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.asset(imagePath,
                width: 130, height: 80, fit: BoxFit.cover),
          ),
          SizedBox(height: 5),
          Text(name, style: TextStyle(fontWeight: FontWeight.bold)),
          Text(location, style: TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }

  Widget bookingTile(
      String name, String status, String time, String imagePath) {
    return Container(
      padding: EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.asset(imagePath,
                width: 80, height: 60, fit: BoxFit.cover),
          ),
          SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: TextStyle(fontWeight: FontWeight.bold)),
              Text(status, style: TextStyle(color: Colors.green, fontSize: 12)),
              Text(time, style: TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          ),
          Spacer(),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
            child: Text("Book", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Widget sectionTitle(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        TextButton(
            onPressed: () {},
            child: Text("See All", style: TextStyle(color: Colors.orange))),
      ],
    );
  }
}
