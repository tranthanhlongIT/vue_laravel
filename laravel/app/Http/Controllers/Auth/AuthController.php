<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'bail|required|max:255',
                'email' => 'bail|email|required|unique:users',
                'password' => 'required|confirmed'
            ]);

            $data['password'] = bcrypt($request->password);

            $user = User::create($data);

            $token = $user->createToken('api token')->accessToken;

            return response()->json([
                'message' => 'Register successful',
                'status' => 200,
                'token' => 'Bearer ' . $token
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->errors(),
                'status' => $e->status
            ]);
        }
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'email|required',
                'password' => 'required'
            ]);

            if (!auth()->attempt($data)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email or password does not match'
                ]);
            }

            if (!auth()->user()->active)
                return response()->json([
                    'status' => false,
                    'message' => 'User not authorized'
                ]);

            $token = auth()->user()->createToken('api token')->accessToken;

            return response()->json([
                'status' => true,
                'message' => 'login successful',
                'current_user' => auth()->user(),
                'token' => 'Bearer ' . $token
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => $e->status,
                'message' => $e->errors(),
            ]);
        }
    }

    public function logout()
    {
        try {
            auth()->user()->token()->revoke();

            return response()->json([
                'status' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false
            ]);
        }
    }
}
