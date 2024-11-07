<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Dadata\DadataClient;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CountryController extends Controller
{
    public function suggestCountries(Request $request)
    {
        $token = env('DADATA_API_KEY');
        $secret = env('DADATA_SECRET_KEY');
        $query = $request->input('query', '');

        $dadata = new DadataClient($token, $secret);
        $result = $dadata->suggest("country", $query);


        $countries = array_map(function ($item) {
            return [
                'value' => $item['value'],
                'data' => $item['data'],
            ];
        }, $result);

        return response()->json($countries);
    }
    public function getEntries()
    {
        $entries = DB::table('entries')->orderBy('created_at', 'desc')->get();
        return response()->json($entries);
    }

    public function addEntry(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email',
            'country' => 'required|string',
        ]);

        DB::table('entries')->insert([
            'email' => $validatedData['email'],
            'country' => $validatedData['country'],
            'created_at' => Carbon::now(),
        ]);

        return response()->json(['message' => 'Запись добавлена'], 201);
    }
}
