import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Replace this with your actual AI Studio Deployment URL!
  static const String baseUrl = 'https://ais-dev-umaceqo4mslh7gnh4yhm4p-537993284055.asia-southeast1.run.app';

  /// Identifies a plant using a captured image encoded in base64.
  /// Calls the secure full-stack backend endpoint `/api/identify-plant`
  /// which integrates the Plant.id API and Gemini Flash fallback.
  static Future<Map<String, dynamic>> identifyPlant(String base64Image) async {
    try {
      final url = Uri.parse('$baseUrl/api/identify-plant');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'image': base64Image}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Server responded with status code ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }

  /// Sends physical questions to the AI assistant backend proxy
  static Future<Map<String, dynamic>> sendChatMessage(String question, List<Map<String, String>> conversationHistory) async {
    try {
      final url = Uri.parse('$baseUrl/api/chat');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'message': question,
          'history': conversationHistory,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to send message: ${response.body}');
      }
    } catch (e) {
      return {
        'success': false,
        'error': e.toString(),
      };
    }
  }
}
