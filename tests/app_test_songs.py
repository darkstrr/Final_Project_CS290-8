import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

#import from parent directory
sys.path.append(os.path.abspath('../'))
from music_fetch import MusicFetch
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_EXPECTED: [],
            },
            {
                KEY_EXPECTED: [],
            },
            {
                KEY_EXPECTED: [],
            },
        ]

    def test_success(self):
        for test in self.success_test_params:
            actual_result = MusicFetch()
            expected_result = test[KEY_EXPECTED]
            print(expected_result)
            self.assertNotEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()