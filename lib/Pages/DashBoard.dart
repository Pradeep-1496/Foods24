import 'package:foods24/Pages/Home.dart';

import 'package:flutter/material.dart';

class Dashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: Text('Foods24'),
      //   centerTitle: true,
      // ),
      body: Container(
        color: Colors.blue, //background color
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("Welcome"),
              SizedBox(
                height: 30,
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => Home()),
                      (route) => false);
                },
                child: Text("Logout"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
