<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        if ($request->search != "")
            $data = Product::select('ProductID', 'ProductName', 'Image', 'categories.CategoryID', 'CategoryName')
                ->join('categories', 'products.CategoryID', '=', 'categories.CategoryID')
                ->where('products.ProductName', 'LIKE', '%' . $request->search . '%')
                ->orWhere('categories.CategoryName', 'LIKE', '%' . $request->search . '%')
                ->paginate(3)->withQueryString();
        else $data = Product::select('ProductID', 'ProductName', 'Image', 'categories.CategoryID', 'CategoryName')
            ->join('categories', 'products.CategoryID', '=', 'categories.CategoryID')
            ->paginate(3);

        return response()->json([
            'data' => $data
        ]);
    }

    public function show(int $id)
    {
        return response()->json([
            "categories" => DB::table('categories')->select('CategoryID', 'CategoryName')->get()
        ]);
    }

    public function create()
    {
        return response()->json([
            "categories" => DB::table('categories')->select('CategoryID', 'CategoryName')->get()
        ]);
    }

    public function store(Request $request)
    {
        try {
            if (isset($request->image) && $request->image != "") {
                $file = request()->file('image');
                $fileName = $file->getClientOriginalName();
                $file->storeAs('images', $fileName);
            }

            $product = Product::create([
                'ProductName' => $request->productName,
                'CategoryID' => $request->categoryID,
                'Image' => $fileName ?? null
            ]);

            return response()->json([
                'product' => $product,
                'status' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => false,
            ]);
        }
    }

    public function edit(int $id)
    {
        $product = DB::table('products')
            ->select('Versionable')
            ->where('ProductID', '=', $id)
            ->limit(1)->get();
        return response()->json([
            "versionable" => Hash::make($product[0]->Versionable),
            "categories" => DB::table('categories')->select('CategoryID', 'CategoryName')->get()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        try {
            if (Hash::check($product->Versionable, $request->Versionable)) {
                $fileName = $product->Image;

                if (isset($request->image)) {
                    $file = request()->file('image');
                    $fileName = $file->getClientOriginalName();
                    $path = storage_path() . '/app/images/' . $fileName;
                    if (!File::exists($path))
                        $file->storeAs('images', $fileName);
                }

                $product->update([
                    "CategoryID" => $request->categoryID ?? $product->CategoryID,
                    "ProductName" => $request->productName ?? $product->Name,
                    "Image" => $fileName,
                    "Versionable" => $product->Versionable + 1
                ]);

                return response()->json([
                    'status' => true,
                    'versionable' => Hash::make($product->Versionable)
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Product has been modified. Please try again',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();

            return response()->json([
                "message" => "Delete successful",
                'status' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage(),
                'status' => false,
            ]);
        }
    }

    public function copy(Product $product)
    {
        try {
            $copyProduct = $product->replicate(["Versionable"]);
            $copyProduct->save();

            return response()->json([
                "message" => "Copy successful",
                'status' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage(),
                'status' => false,
            ]);
        }

    }

    public function getImage($filename)
    {
        $path = storage_path() . '/app/images/' . $filename;

        if (!File::exists($path)) {
            return response()->json(['message' => 'Image not found.'], 404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);

        return $response;
    }
}
