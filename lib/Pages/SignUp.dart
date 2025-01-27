
import 'package:flutter/material.dart';

// ignore: must_be_immutable
class Create extends StatelessWidget {
  var EmailText = TextEditingController();
  var NameText = TextEditingController();
  var PassText = TextEditingController();

  Create({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          // title: Text('SignIn'),
          ),
      body: Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text(
            "SignIn",
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
          ),
          Container(
            height: 60,
          ),
          Container(
            width: 300,
            child: TextField(
                controller: NameText,
                keyboardType: TextInputType.name,
                cursorColor: Colors.blue,
                decoration: InputDecoration(
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: Colors.blue, width: 2)),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: Colors.grey, width: 1)),
                  labelText: 'Enter Name',
                  hintText: "Peter Parker",
                  prefixIcon: Icon(Icons.person),
                  labelStyle: TextStyle(fontSize: 14),
                )),
          ),
          Container(
            height: 20,
          ),
          Container(
            width: 300,
            child: TextField(
                controller: EmailText,
                keyboardType: TextInputType.emailAddress,
                cursorColor: Colors.blue,
                decoration: InputDecoration(
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: Colors.blue, width: 2)),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: Colors.grey, width: 1)),
                  labelText: 'Enter Email',
                  hintText: "Name@xyz.com",
                  prefixIcon: Icon(Icons.email),
                  labelStyle: TextStyle(fontSize: 14),
                )),
          ),
          Container(
            height: 20,
          ),
          Container(
            width: 300,
            child: TextField(
                controller: PassText,
                cursorColor: Colors.blue,
                obscureText: true,
                obscuringCharacter: "*",
                enableSuggestions: false,
                autocorrect: false,
                decoration: InputDecoration(
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: Colors.blue, width: 2)),
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(color: Colors.grey, width: 1)),
                  labelText: 'Password',
                  labelStyle: TextStyle(fontSize: 14),
                  prefixIcon: Icon(Icons.password),
                  // hintText: "!@#%^&*",
                  // suffixText: "🫣",
                  suffixIcon: IconButton(
                      icon: Icon(
                        Icons.remove_red_eye_sharp,
                      ),
                      onPressed: () {}),
                )),
          ),
          Container(height: 20),
          ElevatedButton(
            onPressed: () {
              // Navigator.push(
              //     context,
              //     MaterialPageRoute(
              //       builder: (context) => Login(),
              //     ));
            },
            child: Text("Submit"),
          ),
        ]),
      ),
    );
  }
}
