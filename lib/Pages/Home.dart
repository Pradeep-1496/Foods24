// import './Login.dart';
import './SignUp.dart';
import './Login.dart';

import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          // title: Text('Home'),

          // backgroundColor: Colors.cyanAccent,
          ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              'Welcome...',
              style: TextStyle(fontSize: 30),
            ),
            SizedBox(height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => Create(),
                        ));
                  },
                  child: Text("Create a Account"),
                ),
                Container(
                  width: 30,
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => Login(),
                        ));
                  },
                  child: Text("Login"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
