<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = DB::table('users')
            ->select('users.id', 'users.name', 'users.email', 'users.role_id', 'roles.name as role', 'users.active')
            ->join('roles', 'roles.id', '=', 'users.role_id')
            ->get();

        return response()->json([
            'data' => $data
        ]);
    }

    public function prepareData() {
        return response()->json([
            'roles' => DB::table('roles')->get()
        ]);
    }

    public function store(Request $request)
    {
        try {
            $passwordValidation = Password::min(8)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised();

            $validate = Validator::make($request->all(), [
                'name' => ['bail', 'required', 'max:30'],
                'email' => ['bail', 'required' , 'email'],
                'password' => ['bail', 'required', $passwordValidation],
                'role_id' => ['required'],
                'active' => ['required']
            ]);

            if ($validate){
                $data = $request->all();
                $data['password'] = bcrypt($request->password);
            }

            $user = User::where('email', '=', $request->email)->count();

            if ($user > 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'User already existed'
                ]);
            }

            $user = User::create($data);
            $user->role;

            return response()->json([
                'status' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        try {

            $data = $request->validate([
                'name' => 'bail|required|max:30',
                'role_id' => 'bail|required',
                'active' => 'required'
            ]);

            $user->update($data);
            $user->role;

            return response()->json([
                'status' => true,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function disable(User $user)
    {
        $user->update(['active' => false]);
        $user->role;

        return response()->json([
            'status' => true,
            'user' => $user,
        ]);
    }
}
