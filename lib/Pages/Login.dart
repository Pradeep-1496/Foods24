import 'package:foods24/Pages/DashBoard.dart';
import 'package:foods24/Pages/SignUp.dart';
import 'package:flutter/material.dart';

class Login extends StatelessWidget {
  final NameText = TextEditingController();
  final PassText = TextEditingController();

  Login({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          // title: Text('Login'),
          ),
      body: Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text(
            "Login",
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
          ),
          Container(
            height: 60,
          ),
          Container(
            width: 300,
            child: TextField(
                controller: NameText,
                keyboardType: TextInputType.emailAddress,
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
              if (NameText.text == "admin" && PassText.text == "123") {
                Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => Dashboard()),
                    (route) => false);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content:
                        Center(child: Text('Invalid username or password')),
                  ),
                );
              }
            },
            child: Text("Login"),
          ),
          Container(height: 20),
          TextButton(
            onPressed: () {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => Create(),
                  ));
            },
            child: Text('Create an Account'),
          ),
        ]),
      ),
    );
  }
}
