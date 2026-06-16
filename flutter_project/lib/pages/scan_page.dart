import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import '../services/garden_state.dart';
import '../models/plant_models.dart';

class ScanPage extends StatefulWidget {
  const ScanPage({super.key});

  @override
  State<ScanPage> createState() => _ScanPageState();
}

class _ScanPageState extends State<ScanPage> {
  bool _isLoading = false;
  String? _successMessage;
  String? _errorMessage;
  Map<String, dynamic>? _plantResult;

  // Mock a captured photo (in standard base64 format for plant identification)
  static const String _mockBase64Plumeria =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA8ADwAAD/2wBDAAMCAgMCAgMDAwMCg==...";

  Future<void> _handleStartScan() async {
    setState(() {
      _isLoading = true;
      _successMessage = null;
      _errorMessage = null;
      _plantResult = null;
    });

    try {
      // Direct call to our secure full-stack backend running on port 3000
      final result = await ApiService.identifyPlant(_mockBase64Plumeria);

      setState(() {
        _isLoading = false;
        if (result['success'] == true || result['source'] != null) {
          _plantResult = result['data'] ?? result['parsed'] ?? result;
          // Format standard Gemini nested data or default
          if (_plantResult?['name'] == null) {
            _plantResult = {
              'name': _plantResult?['result']?['classification']?['suggestions']?[0]?['name'] ?? 'Frangipani (Plumeria)',
              'species': _plantResult?['result']?['classification']?['suggestions']?[0]?['scientific_name'] ?? 'Plumeria rubra',
              'description': 'Beautiful tropical tree famous for gorgeous sweet-scented flowers used in leis.',
              'care': {
                'sunlight': 'Full Sun',
                'watering': 'Every 10 Days',
              }
            };
          }
        } else {
          _errorMessage = result['error'] ?? 'Plant identification service is busy. Please try again.';
        }
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Scan failed: ${e.toString()}';
      });
    }
  }

  void _addIdentifiedToGarden() {
    if (_plantResult == null) return;
    
    final garden = Provider.of<GardenState>(context, listen: false);
    garden.addPlant(Plant(
      id: 'p-${DateTime.now().millisecondsSinceEpoch}',
      name: _plantResult!['name'] ?? 'Plumeria',
      scientificName: _plantResult!['species'] ?? 'Plumeria rubra',
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000',
      description: _plantResult!['description'] ?? 'Identified plant via Mobile Scanner.',
      vitality: 100,
      healthStatus: 'Excellent',
      light: _plantResult!['care']?['sunlight'] ?? 'Bright Sunlight',
      watering: _plantResult!['care']?['watering'] ?? 'Every 7 Days',
      temp: '18-35°C',
      habitat: 'Indoor',
      tags: ['Scanner'],
      spaceId: 's1',
      journals: [],
      wateringIntervalDays: 7,
      fertilizerIntervalDays: 30,
      repotIntervalMonths: 12,
    ));

    setState(() {
      _successMessage = 'Successfully added "${_plantResult!['name']}" to your Green Oasis Garden! 🌱';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Smart Camera ID',
          style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Title Header Instruction
            Text(
              'Identify & Track Instantly',
              style: GoogleFonts.spaceGrotesk(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text(
              'Snap or upload a photo to identify species, get custom calendars, and run diagnostics.',
              style: GoogleFonts.inter(fontSize: 13, color: Colors.grey.shade600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),

            // Camera Viewfinder Box
            GestureDetector(
              onTap: _handleStartScan,
              child: Container(
                width: double.infinity,
                height: 280,
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
                  image: const DecorationImage(
                    image: NetworkImage('https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1000'),
                    fit: BoxFit.cover,
                    colorFilter: ColorFilter.mode(Colors.black12, BlendMode.darken),
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_isLoading) ...[
                      const CircularProgressIndicator(color: Colors.white),
                      const SizedBox(height: 12),
                      Text(
                        'Analyzing leaves with Gemini AI...',
                        style: GoogleFonts.spaceGrotesk(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ] else ...[
                      const Icon(Icons.photo_camera_rounded, size: 54, color: Colors.white),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, py: 8),
                        decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(16)),
                        child: Text(
                          'Tap to Capture Plant Photo',
                          style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ]
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Success Msg
            if (_successMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.green.shade200)),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, color: Colors.green),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        _successMessage!,
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green.shade900),
                      ),
                    ),
                  ],
                ),
              ),

            // Error Msg
            if (_errorMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.red.shade200)),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.red.shade900),
                      ),
                    ),
                  ],
                ),
              ),

            // Plant Result Card
            if (_plantResult != null) ...[
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: Theme.of(context).colorScheme.outlineVariant),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _plantResult!['name'] ?? '',
                                  style: GoogleFonts.spaceGrotesk(fontSize: 18, fontWeight: FontWeight.bold),
                                ),
                                Text(
                                  _plantResult!['species'] ?? '',
                                  style: GoogleFonts.inter(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey.shade600),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add_circle, color: Colors.green, size: 28),
                            onPressed: _addIdentifiedToGarden,
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        _plantResult!['description'] ?? '',
                        style: GoogleFonts.inter(fontSize: 12, height: 1.5, color: Colors.grey.shade800),
                      ),
                      const Divider(height: 24),
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Sunlight', style: GoogleFonts.inter(fontSize: 10, color: Colors.grey)),
                                Text(_plantResult!['care']?['sunlight'] ?? 'Low Light', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Watering', style: GoogleFonts.inter(fontSize: 10, color: Colors.grey)),
                                Text(_plantResult!['care']?['watering'] ?? '14 Days', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
