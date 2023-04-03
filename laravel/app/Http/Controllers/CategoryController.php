<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function getAll() {
        return response()->json([
            'data' => DB::table('categories')
                ->select('CategoryID', 'CategoryName')
                ->get()
        ]);
    }


    public function index(Request $request)
    {
        if ($request->search != "") {
            $data = DB::table('categories')
                ->where('CategoryName', 'LIKE', '%' . $request->search . '%')
                ->paginate(2)->withQueryString();
        } else  $data = DB::table('categories')->paginate(2);


        return response()->json([
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $data = Category::create([
            'CategoryName' => $request->categoryName
        ]);

        return response()->json([
            'data' => $data
        ], 200);
    }

    public function update(Request $request, Category $category)
    {
        $category->update([
            'CategoryName' => $request->categoryName
        ]);

        return response()->json([
            'data' => $category
        ], 200);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 1
        ], 200);
    }
}
